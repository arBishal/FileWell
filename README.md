# FileWell

A minimalist, recursive file system explorer built with React and Tailwind CSS. A clean, drag-and-drop interface for managing files and folders—all.


## Features

- **Recursive Folder Structure**
  - Tree-like file system navigation
  - Infinite nesting support
  - Visual folder/file distinction

- **Drag & Drop Operations**
  - Intuitive drag-and-drop interface
  - Move items between folders
  - Visual feedback during drag operations

- **Quick Actions**
  - Create new folders
  - Upload files (simulated)
  - Rename items
  - Delete items

- **Navigation**
  - Breadcrumb path display
  - Single/double-click interactions

### To-Implement

- Rename folders/files in-place
- Sort folders/files
- Add color suppport
- Open/preview files
- Details panel
- Intro panel
- Use IndexedDB instead of Local Storage


## Tech Stack

- React 19
- Tailwind CSS v4
- Vite
- Browser APIs (Drag & Drop, File System)


## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bottomless-drop.git
```

2. Navigate to project directory
```bash
cd bottomless-drop
```

3. Install dependencies
```bash
npm install
```

4. Start development server
```bash
npm run dev
```


## Project Structure

```
bottomless-drop/
├── src/
│   ├── components/
│   │   ├── ItemCard.jsx       # File/folder item component
│   │   ├── Popover.jsx       # Actions menu component
│   │   └── ...
│   ├── store/
│   │   └── useFolderStore.js # State management
│   ├── pages/
│   │   └── Home.jsx          # Main page component
│   └── App.jsx               # Root component
├── public/
└── ...
```


## Usage

- **Create Folder**: Click the **+** button
- **Upload File**: Click the **⤴︎** button
- **Rename/Delete**: Use the **⋮** on any item
- **Move Items**: Drag any file/folder into a target folder
- **Highlight**: Single-click files/folders to select
- **Navigate**: Double-click folders to enter 
