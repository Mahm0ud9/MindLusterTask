import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/tasksApi';

/**
 * Query key factory for React Query cache.
 * Use taskKeys.lists() for the main tasks list so all task data shares one cache entry.
 */
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
};

/**
 * Fetches all tasks with caching.
 */
export const useTasks = () => {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5, // Keep data fresh for 5 minutes
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Updates a task with optimistic UI: cache is updated immediately, then rolled back on error.
 * onSettled invalidates the list so the server remains the source of truth.
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueryData(taskKeys.lists(), (old) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        );
      });

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};

/**
 * Deletes a task with optimistic UI: task is removed from cache immediately, rolled back on error.
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData(taskKeys.lists());

      queryClient.setQueryData(taskKeys.lists(), (old) => {
        if (!old) return old;
        return old.filter((task) => task.id !== taskId);
      });

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
};
