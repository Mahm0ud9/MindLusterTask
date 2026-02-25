import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { COLUMNS } from '../../utils/constants';

const TaskForm = ({ open, onClose, onSubmit, task = null, initialColumn = 'backlog' }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState('backlog');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setColumn(task.column);
      setPriority(task.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setColumn(initialColumn || 'backlog');
      setPriority('medium');
    }
    setErrors({});
  }, [task, open, initialColumn]);

  const TITLE_MAX = 80;
  const TITLE_MIN = 2;
  const DESCRIPTION_MAX = 300;

  const validateField = (name, value) => {
    switch (name) {
      case 'title': {
        const t = (value || '').trim();
        if (!t) return 'Title is required';
        if (t.length < TITLE_MIN) return `Title must be at least ${TITLE_MIN} characters`;
        if (t.length > TITLE_MAX) return `Title must be ${TITLE_MAX} characters or less`;
        return '';
      }
      case 'description':
        if ((value || '').trim().length > DESCRIPTION_MAX) return `Description must be ${DESCRIPTION_MAX} characters or less`;
        return '';
      case 'column':
        return !value ? 'Please select a column' : '';
      case 'priority':
        return !value ? 'Please select a priority' : '';
      default:
        return '';
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    if (field === 'title') setTitle(value);
    else if (field === 'description') setDescription(value);
    else if (field === 'column') setColumn(value);
    else if (field === 'priority') setPriority(value);
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) || undefined }));
  };

  const handleBlur = (field) => () => {
    const value = field === 'title' ? title : field === 'description' ? description : field === 'column' ? column : priority;
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err || undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      title: validateField('title', title),
      description: validateField('description', description),
      column: validateField('column', column),
      priority: validateField('priority', priority),
    };
    const normalized = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v).map(([k, v]) => [k, v])
    );

    if (Object.keys(normalized).length > 0) {
      setErrors(normalized);
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      column,
      priority,
    };

    if (task) {
      onSubmit({ id: task.id, ...taskData });
    } else {
      onSubmit(taskData);
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={handleChange('title')}
              onBlur={handleBlur('title')}
              error={!!errors.title}
              helperText={errors.title || (title.length > 0 ? `${title.length}/${TITLE_MAX}` : '')}
              required
              fullWidth
              autoFocus
              inputProps={{ maxLength: TITLE_MAX, 'aria-invalid': !!errors.title }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={handleChange('description')}
              onBlur={handleBlur('description')}
              error={!!errors.description}
              helperText={errors.description || (description.length > 0 ? `${description.length}/${DESCRIPTION_MAX}` : '')}
              multiline
              rows={4}
              fullWidth
              inputProps={{ maxLength: DESCRIPTION_MAX, 'aria-invalid': !!errors.description }}
            />
            <TextField
              select
              label="Column"
              value={column}
              onChange={handleChange('column')}
              onBlur={handleBlur('column')}
              error={!!errors.column}
              helperText={errors.column}
              fullWidth
              SelectProps={{ 'aria-invalid': !!errors.column }}
            >
              {COLUMNS.map((col) => (
                <MenuItem key={col.id} value={col.id}>
                  {col.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={handleChange('priority')}
              onBlur={handleBlur('priority')}
              error={!!errors.priority}
              helperText={errors.priority}
              fullWidth
              SelectProps={{ 'aria-invalid': !!errors.priority }}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">Cancel</Button>
          <Button type="submit" variant="contained">
            {task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;
