import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Container, Box, Snackbar, Alert, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import { useDispatch, useSelector } from 'react-redux';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { COLUMNS } from '../utils/constants';
import Column from '../components/Column/Column';
import SearchBar from '../components/SearchBar/SearchBar';
import TaskForm from '../components/TaskForm/TaskForm';
import {
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
} from '../features/tasks/tasksSlice';

const BoardPage = () => {
  const dispatch = useDispatch();
  const { data: tasks = [], isLoading, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const isCreateModalOpen = useSelector((state) => state.tasksUi.isCreateModalOpen);
  const isEditModalOpen = useSelector((state) => state.tasksUi.isEditModalOpen);
  const selectedTaskId = useSelector((state) => state.tasksUi.selectedTaskId);

  // Track which column we're creating a task in (defaults to backlog)
  const [createColumn, setCreateColumn] = React.useState('backlog');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  /** Group tasks by column for rendering each Kanban column. */
  const tasksByColumn = React.useMemo(() => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    const grouped = {
      backlog: [],
      in_progress: [],
      review: [],
      done: [],
    };

    // Sort tasks by priority first
    const sortedTasks = [...tasks].sort((a, b) => {
      const pA = priorityOrder[a.priority?.toLowerCase()] || 4;
      const pB = priorityOrder[b.priority?.toLowerCase()] || 4;
      return pA - pB;
    });

    sortedTasks.forEach((task) => {
      if (grouped[task.column]) {
        grouped[task.column].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  /** On drag end: if task moved to another column, PATCH task.column via React Query. */
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const task = tasks.find((t) => String(t.id) === draggableId);

    if (task && task.column !== destination.droppableId) {
      updateTaskMutation.mutate({
        id: task.id,
        column: destination.droppableId,
      });
    }
  };

  const handleCreateTask = (taskData) => {
    createTaskMutation.mutate(taskData, {
      onSuccess: () => setSnackbar({ open: true, message: 'Task created', severity: 'success' }),
    });
  };

  const handleUpdateTask = (taskData) => {
    updateTaskMutation.mutate(taskData, {
      onSuccess: () => setSnackbar({ open: true, message: 'Task updated', severity: 'success' }),
    });
  };

  const handleRequestDeleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setTaskToDelete(task || null);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate(taskToDelete.id);
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  /** Open edit modal: Redux stores selectedTaskId, TaskForm reads selectedTask from list. */
  const handleEditTask = (task) => {
    dispatch(openEditModal(task.id));
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">Loading tasks...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Error loading tasks: {error.message}
        </Alert>
      </Container>
    );
  }

  const totalTasks = tasks.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            py: 2,
            mb: 4, // Added more margin bottom
            pb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            borderBottom: '1px solid #E5E7EB',
            boxShadow: '0 1px 0 0 rgba(0,0,0,0.05)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 2,
                  backgroundColor: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AppsIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: '#111827',
                  }}
                >
                  KANBAN BOARD
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#6B7280', ml: '36px' }}>
              {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Box sx={{ minWidth: { xs: '100%', md: 320 } }}>
            <SearchBar />
          </Box>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
            }}
          >
            {COLUMNS.map((column) => (
              <Box key={column.id}>
                <Column
                  columnId={column.id}
                  columnLabel={column.label}
                  tasks={tasksByColumn[column.id]}
                  onEdit={handleEditTask}
                onDelete={handleRequestDeleteTask}
                  onAdd={() => {
                    setCreateColumn(column.id);
                    dispatch(openCreateModal());
                  }}
                />
              </Box>
            ))}
          </Box>
        </DragDropContext>
      </Box>

      {/* Create modal: opened by "+ Add task" per column; initialColumn set before open. */}
      <TaskForm
        open={isCreateModalOpen}
        onClose={() => dispatch(closeCreateModal())}
        onSubmit={handleCreateTask}
        initialColumn={createColumn}
      />

      {/* Edit modal: selectedTaskId from Redux; selectedTask derived from tasks list. */}
      <TaskForm
        open={isEditModalOpen}
        onClose={() => dispatch(closeEditModal())}
        onSubmit={handleUpdateTask}
        task={selectedTask}
      />

      <Snackbar
        open={snackbar.open || createTaskMutation.isError || updateTaskMutation.isError || deleteTaskMutation.isError}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbar((prev) => ({ ...prev, open: false }));
          createTaskMutation.reset();
          updateTaskMutation.reset();
          deleteTaskMutation.reset();
        }}
      >
        <Alert
          severity={createTaskMutation.isError || updateTaskMutation.isError || deleteTaskMutation.isError ? 'error' : snackbar.severity}
          onClose={() => {
            setSnackbar((prev) => ({ ...prev, open: false }));
            createTaskMutation.reset();
            updateTaskMutation.reset();
            deleteTaskMutation.reset();
          }}
        >
          {createTaskMutation.isError || updateTaskMutation.isError || deleteTaskMutation.isError
            ? 'An error occurred. Please try again.'
            : snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {taskToDelete
              ? `Are you sure you want to delete “${taskToDelete.title}”? This action cannot be undone.`
              : 'Are you sure you want to delete this task? This action cannot be undone.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BoardPage;
