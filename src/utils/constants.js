// Column definitions (labels match reference UI: TO DO, IN PROGRESS, IN REVIEW, DONE)
export const COLUMNS = [
  { id: 'backlog', label: 'TO DO', color: '#3B82F6' }, // blue
  { id: 'in_progress', label: 'IN PROGRESS', color: '#F59E0B' }, // orange
  { id: 'review', label: 'IN REVIEW', color: '#8B5CF6' }, // purple
  { id: 'done', label: 'DONE', color: '#10B981' }, // green
];

// API base URL
export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? '/api'
  : 'http://localhost:4000';

// Pagination defaults (3 tasks per page)
export const DEFAULT_PAGE_SIZE = 3;
