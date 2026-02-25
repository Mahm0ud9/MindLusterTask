import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

const initialState = {
  searchText: '',
  selectedTaskId: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  pagination: {
    backlog: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
    in_progress: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
    review: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
    done: { page: 1, pageSize: DEFAULT_PAGE_SIZE },
  },
};

const tasksSlice = createSlice({
  name: 'tasksUi',
  initialState,
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    openCreateModal: (state) => {
      state.isCreateModalOpen = true;
    },
    closeCreateModal: (state) => {
      state.isCreateModalOpen = false;
    },
    openEditModal: (state, action) => {
      state.selectedTaskId = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedTaskId = null;
    },
    setColumnPage: (state, action) => {
      const { column, page } = action.payload;
      state.pagination[column].page = page;
    },
  },
});

export const {
  setSearchText,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setColumnPage,
} = tasksSlice.actions;

export default tasksSlice.reducer;
