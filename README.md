# Kanban Board Task

A clean and responsive Kanban-style ToDo dashboard built with React and Material UI. This project uses Redux for UI state and React Query for efficient data fetching and caching.

## Features
- **4 Columns**: TO DO, IN PROGRESS, IN REVIEW, DONE.
- **Drag & Drop**: Easily move tasks between stages.
- **Task Management**: Create, edit, and delete tasks.
- **Priority Sorting**: High-priority tasks automatically stay at the top.
- **Search**: Filter tasks by title or description in real-time.
- **Pagination**: 3 tasks per column to keep the board organized.

## Project Structure
- `src/components`: UI components (Column, TaskCard, TaskForm, SearchBar).
- `src/hooks`: Custom hooks for data management (Optimistic updates).
- `src/features`: Redux state for UI logic.
- `src/api`: Axios configuration for the mock backend.

## How to Run Internally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
In a new terminal window, run the mock API:
```bash
npm run server
```
*The server will run on http://localhost:4000*

### 3. Start the Application
In your main terminal, start the development server:
```bash
npm run dev
```
*The app will be available at http://localhost:3000*

## Live Preview
The project is also configured for deployment on Vercel. Once pushed to GitHub and linked to Vercel, the API will be available under the `/api` prefix, and the frontend will automatically connect to it.

---
Happy Coding!
