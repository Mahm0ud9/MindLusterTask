import React from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '../../features/tasks/tasksSlice';

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.tasksUi.searchText);

  const handleChange = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Search tasks..."
        variant="outlined"
        size="small"
        value={searchText}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#9CA3AF', fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            backgroundColor: '#F3F4F6',
            '& fieldset': {
              borderColor: '#E5E7EB',
            },
            '&:hover fieldset': {
              borderColor: '#D1D5DB',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F46E5',
              borderWidth: '1.5px',
            },
          },
          '& input': {
            color: '#374151',
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
