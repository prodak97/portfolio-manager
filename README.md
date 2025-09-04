# Portfolio Manager

A React TypeScript application for managing your projects and organizing your skills with **enhanced data safety** features.

## Features

- **Project Management**: Add, view, and delete projects with descriptions and associated skills
- **Skills Organization**: Categorize skills by type (Frontend, Backend, Tools, etc.) and proficiency level
- **Enhanced Data Safety**: 
  - **Auto-save with visual feedback**: See when your data is being saved
  - **Backup system**: Automatic backups with recovery capabilities
  - **Error handling**: Graceful handling of storage failures
  - **Debounced saving**: Prevents excessive saves while typing
- **Local Storage**: All data is saved locally in your browser
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and intuitive interface

## Data Safety Features

### 🛡️ Automatic Saving
- **Real-time feedback**: Visual indicators show when data is being saved
- **Debounced saves**: Changes are saved 500ms after you stop typing
- **Save confirmation**: "✅ All changes saved" message appears after successful saves

### 🔄 Backup System
- **Automatic backups**: Every save creates a timestamped backup
- **Backup recovery**: If primary data is corrupted, automatically recovers from backup
- **Backup management**: Keeps only the last 3 backups to save space

### ⚠️ Error Handling
- **Storage failure detection**: Alerts you if data cannot be saved
- **Graceful degradation**: Continues working even if localStorage is unavailable
- **Error recovery**: Automatic retry mechanisms for failed saves

### 📊 Data Management
- **Export functionality**: Download your portfolio data as JSON
- **Clear all data**: Safely reset to default values with confirmation
- **Data validation**: Ensures data integrity before saving

## Prerequisites

Before running this application, you need to install Node.js and npm:

1. Download and install Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Verify installation by running:
   ```bash
   node --version
   npm --version
   ```

## Installation

1. Navigate to the project directory:
   ```bash
   cd portfolio-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:5173`

## How to Use

### Projects Tab
- **Add a Project**: Fill out the form with project name, description, skills (comma-separated), and date
- **View Projects**: See all your projects displayed in cards
- **Delete Projects**: Click the "Delete" button on any project card

### Skills Tab
- **Add a Skill**: Enter skill name, category (e.g., Frontend, Backend, Tools), and proficiency level
- **View Skills**: Skills are automatically grouped by category
- **Delete Skills**: Click the "Delete" button on any skill card

### Data Persistence
- All data is automatically saved to your browser's localStorage
- Data persists between browser sessions
- No server or database required

## Project Structure

```
portfolio-manager/
├── src/
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling
- **localStorage** - Data persistence

## Customization

You can customize the application by:

1. **Adding new skill categories**: Modify the form in `App.tsx`
2. **Changing colors**: Update the CSS variables in `App.css`
3. **Adding new fields**: Extend the Project or Skill interfaces
4. **Modifying layout**: Adjust the CSS grid and flexbox properties

## Troubleshooting

If you encounter issues:

1. **Dependencies not found**: Run `npm install` again
2. **Port already in use**: The dev server will automatically use a different port
3. **Data not saving**: Check if localStorage is enabled in your browser
4. **TypeScript errors**: Make sure all dependencies are properly installed


## Changelog

- Project start and end dates are now displayed in dd/mm/yy format for consistency and improved readability.
- Added Core Competencies section: displays a dot-list of skill categories in the portfolio view.

## Future Enhancements

Potential features to add:
- Export/import data functionality
- Project images and links
- Skill proficiency tracking over time
- Search and filter capabilities
- Dark mode toggle
- Data backup to cloud storage 