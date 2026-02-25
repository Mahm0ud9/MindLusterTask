import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const getPriorityConfig = (priority) => {
  switch (priority) {
    case 'high':
      return {
        label: 'HIGH',
        bg: '#FEE2E2',
        color: '#DC2626',
      };
    case 'medium':
      return {
        label: 'MEDIUM',
        bg: '#FEF3C7',
        color: '#D97706',
      };
    case 'low':
    default:
      return {
        label: 'LOW',
        bg: '#DBEAFE',
        color: '#2563EB',
      };
  }
};

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const { label, bg, color } = getPriorityConfig(task.priority);
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            mb: 2,
            cursor: 'grab',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            },
          }}
        >
          <CardContent sx={{ p: 1.75 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
                gap: 1,
              }}
            >
              <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, color: '#111827' }}>
                {task.title}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mb: 1.5, minHeight: '40px', color: '#6B7280', fontSize: 12 }}
            >
              {task.description || 'No description'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Chip
                label={label}
                size="small"
                sx={{
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  px: 1,
                  height: 22,
                  borderRadius: 999,
                  backgroundColor: bg,
                  color,
                }}
              />
              <Tooltip title="Edit task">
                <IconButton
                  size="small"
                  onClick={() => onEdit(task)}
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => onDelete(task.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
