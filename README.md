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
- **Core Competencies**: Define high-level categories with descriptions
- **Additional Details**: Add any extra categorized details similar to core competencies
- **Resume Link**: Store a resume URL and expose a "View Resume" link in the portfolio
- **Quick Navigation**: Fixed "View Portfolio" button to smoothly scroll to the portfolio section
- **Download CV (PDF)**: One-click PDF export of the portfolio view
- **Import/Export JSON**: Load and save all portfolio data via JSON files

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
 - **Safe JSON parsing**: Corrupted or invalid saved data/backups are safely ignored to prevent crashes

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

### Editing Your Portfolio
- **Basics**: Name, Bio, Professional Summary, Email, LinkedIn, Location, Image URL, Languages
- **Resume URL**: Paste the link to your resume (PDF or website). It appears as a "View Resume" link in the Contact section.
- **Education**: Add entries with institution, degree, start and end dates
- **Core Competencies**: Add category + description rows
- **Additional Details**: Add any extra category + description rows (e.g., Certifications, Volunteering)
- **Skills**: Add skills with category and proficiency; they are grouped by category in the display
- **Projects**: Add projects with description, technologies, and dates
- **Quick Navigation**: Use the fixed "View Portfolio" button to jump to the portfolio display

### Export Your CV as PDF
- Click the fixed "Download CV" button (bottom-right) to export the current portfolio view as a multi-page A4 PDF.
- The PDF uses a self-contained, print-friendly resume layout (no Tailwind) for reliability.
- Tip: Keep text concise; projects are condensed (top 6) to fit fewer pages.

### Import/Export Your Data
- Export: Use "Export JSON" in the editor to download `portfolio-data.json`.
- Import: Use "Import JSON" to select a JSON file and populate all fields.

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
├── public/              # Static assets (or /src/img for bundled images)
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
- **html2canvas + jsPDF** - Client-side PDF generation for the CV export
- **TypeScript + React** - Typed UI and data flow

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

- Project start and end dates display in dd/mm/yy format.
- Added Core Competencies section with category + description.
- Added Additional Details section (category + description) with editor and display.
- Implemented Resume URL field and "View Resume" link in Contact.
- Added fixed "View Portfolio" button for smooth scrolling to portfolio.
- Hardened storage with safe JSON parsing for primary and backup data.
- Added PDF export: fixed "Download CV" button using html2canvas and jsPDF.
- Implemented self-contained CV rendering for PDF (condensed, print-friendly).
- Added Import JSON to load entire portfolio data.
- Improved accessibility: ids/names on fields and appropriate autocomplete attributes.

## Troubleshooting

- Blank PDF output: The app now renders a separate, inline-styled resume for export to avoid CSS incompatibilities; if still blank, check console for image CORS warnings.
- Storage quota exceeded: Backups auto-trim; clear site storage if needed.
- Import errors: Ensure the JSON matches the schema; at minimum `name` and `email` are required.
- Moved additional details to the end of portfolio.

## Future Enhancements

Potential features to add:
- Export/import data functionality
- Project images and links
- Skill proficiency tracking over time
- Search and filter capabilities
- Dark mode toggle
- Data backup to cloud storage      