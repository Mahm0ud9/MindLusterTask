import { configureStore } from '@reduxjs/toolkit';
import tasksUiReducer from '../features/tasks/tasksSlice';

export const store = configureStore({
  reducer: {
    tasksUi: tasksUiReducer,
  },
});
