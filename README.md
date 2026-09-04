# Project Management System

A simple frontend-only Project Management System built with React. Manage Projects, Goals, and Tasks with full CRUD functionality — all data is stored in the browser's LocalStorage, so no backend or database is required.

## Features

- **Projects**: Create, view, edit, and delete projects with name, description, priority, status, and start/end dates.
- **Goals**: Create goals linked to a specific project. Only goals belonging to the selected project are shown.
- **Tasks**: Create tasks linked to a specific project and goal. The goal dropdown updates based on the selected project.
- **Dashboard**: Overview showing total counts (Projects, Goals, Tasks) and a hierarchical view of Project → Goal → Task relationships.
- Form validation on all forms (required fields, date range checks).
- Confirmation prompt before deleting any item.
- Data persists across page refreshes using LocalStorage.
- Reusable `SharedFields` component used across Projects, Goals, and Tasks forms.

## Tech Stack

- React (functional components + hooks)
- React Router (page navigation)
- LocalStorage (data persistence)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/ghazanfarali43r54-sudo/Project-Management-System.git
   cd my-project
```

2. Install dependencies:
```bash
   npm install
```

3. Start the development server:
```bash
   npm run dev


4. Open your browser at `http://localhost:5173` (Vite's default port — the exact URL will also be shown in your terminal).

## Project Structure
src/
├── components/
│ ├── Nabare.jsx
│ └── SharedFields.jsx
├── pages/
│ ├── Projects.jsx
│ ├── Goals.jsx
│ ├── Tasks.jsx
│ └── Dashboard.jsx
├── App.jsx
└── main.jsx


## How It Works

- **Projects** are the top-level entity. Each project has its own goals.
- **Goals** must be linked to a project. When adding/editing a goal, you first select the project it belongs to.
- **Tasks** must be linked to both a project and a goal. Selecting a project filters the available goals in the dropdown.
- All data (`projects`, `goals`, `tasks`) is stored separately in LocalStorage and loaded automatically when the app starts.

## Notes

- This is a frontend-only project — no backend or external database is used.
- Data is stored locally in your browser, so it will not sync across different browsers or devices.