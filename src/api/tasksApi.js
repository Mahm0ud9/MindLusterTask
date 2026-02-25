import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all tasks from the API
 */
export const fetchTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

/**
 * Create a new task
 */
export const createTask = async (task) => {
  const response = await api.post('/tasks', task);
  return response.data;
};

/**
 * Update an existing task
 */
export const updateTask = async ({ id, ...updates }) => {
  const response = await api.patch(`/tasks/${id}`, updates);
  return response.data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
  return id;
};
