import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Pagination,
  Alert,
  Button,
} from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import TaskCard from '../TaskCard/TaskCard';
import { setColumnPage } from '../../features/tasks/tasksSlice';
import { COLUMNS } from '../../utils/constants';

const Column = ({ columnId, columnLabel, tasks, onEdit, onDelete, onAdd }) => {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.tasksUi.searchText);
  const pagination = useSelector((state) => state.tasksUi.pagination[columnId]);

  // Filter tasks by search text
  const filteredTasks = useMemo(() => {
    if (!searchText.trim()) return tasks;

    const lowerSearch = searchText.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerSearch) ||
        task.description?.toLowerCase().includes(lowerSearch)
    );
  }, [tasks, searchText]);

  // Paginate tasks
  const paginatedTasks = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, pagination]);

  const totalPages = Math.ceil(filteredTasks.length / pagination.pageSize);

  const handlePageChange = (event, value) => {
    dispatch(setColumnPage({ column: columnId, page: value }));
  };

  const columnMeta = COLUMNS.find((c) => c.id === columnId);
  const dotColor = columnMeta?.color || '#9CA3AF';

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#EDEFF3',
        borderRadius: 2,
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: dotColor,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              color: '#374151',
            }}
          >
            {columnLabel}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#6B7280' }}>
          {filteredTasks.length}
        </Typography>
      </Box>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 1,
              minHeight: '200px',
              backgroundColor: snapshot.isDraggingOver ? `${dotColor}14` : 'transparent',
              border: snapshot.isDraggingOver ? `2px dashed ${dotColor}` : '2px dashed transparent',
              borderRadius: 1,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            }}
          >
            {paginatedTasks.length === 0 ? (
              <Alert severity="info" variant="outlined" sx={{ mt: 2 }}>
                {filteredTasks.length === 0
                  ? 'No tasks in this column'
                  : 'No tasks on this page'}
              </Alert>
            ) : (
              paginatedTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {totalPages > 1 && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Box>
      )}

      <Button
        fullWidth
        variant="outlined"
        onClick={onAdd}
        sx={{
          mt: 2,
          py: 1.25,
          borderStyle: 'dashed',
          borderColor: '#D1D5DB',
          color: '#6B7280',
          textTransform: 'none',
          fontSize: 13,
          '&:hover': {
            borderColor: '#9CA3AF',
            backgroundColor: '#E5E7EB',
          },
        }}
      >
        + Add task
      </Button>
    </Paper>
  );
};

export default Column;
