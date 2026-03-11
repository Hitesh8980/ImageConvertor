# CircuitLens — Diagram Dashboard

> A professional React dashboard for uploading and analyzing circuit diagrams with interactive component detection.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## 📸 Overview

CircuitLens is a frontend assessment project built with React 18 and Vite. It allows users to upload circuit diagram images, view them with zoom and pan controls, and browse a list of detected components in a clean industrial dark UI.

---

## ✨ Features

### Core
- **Upload Diagram** — Drag & drop or click to upload PNG, JPG, or WebP images
- **Image Preview** — Instantly see a thumbnail and file metadata after upload
- **Replace & Remove** — Swap out or clear the uploaded image at any time
- **Diagram Viewer** — Full image viewer with zoom in/out, scroll-to-zoom, pan, and reset
- **Component List** — Sidebar showing detected components from mock API with live search/filter
- **Component Selection** — Click any component to highlight it; selected badge appears on the diagram

### Bonus
- 🔄 **Upload Progress Animation** — Animated progress bar with glowing dot while processing
- ✅ **File Size Validation** — Blocks files over 10MB with exact size shown in error
- ❌ **Inline Error UI** — No `alert()` — errors appear as dismissable banners below the upload zone
- 🗑️ **Remove Button** — One-click image removal resets the entire viewer
- 🎯 **Drag Highlight Animation** — Full overlay with bounce animation when dragging a file over the zone
- 🖱️ **Scroll to Zoom** — Mouse wheel zooms directly on the diagram without moving the page
- 📱 **Responsive Layout** — Stacks vertically on tablet and mobile screens

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| React 18 | UI library — functional components only |
| Vite 5 | Build tool and dev server |
| Tailwind CSS 3 | Utility classes (configured, available throughout) |
| Custom CSS | Industrial dark theme via CSS custom properties |
| No UI libraries | All components built from scratch |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/Hitesh8980/ImageConvertor.git

# 2. Navigate into the project
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Scripts

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
circuit-lens-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── UploadBox.jsx       # Drag-drop upload, progress, validation, replace/remove
│   │   ├── DiagramViewer.jsx   # Image viewer with zoom, scroll-to-zoom, pan
│   │   └── ComponentList.jsx   # Sidebar list with search, selection, skeleton loader
│   ├── pages/
│   │   └── Dashboard.jsx       # Main layout — composes all components
│   ├── services/
│   │   └── api.js                  # Mock API with simulated network delay (900ms)
│   ├── hooks/
│   │   └── useZoom.js              # Custom hook for zoom state management
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css                   # Global styles, CSS variables, animations
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🧠 Implementation Details

### React Hooks Used
- `useState` — upload state, zoom level, pan position, selected component, drag state, error, loading
- `useEffect` — fetching mock component data on mount, attaching passive wheel event listener
- `useRef` — referencing the file input element and viewer canvas DOM node
- `useCallback` — memoizing file handler and drop handler to avoid unnecessary re-renders
- **Custom Hook** — `useZoom` encapsulates all zoom logic (min/max clamping, step controls, reset)

### Key Technical Decisions

**Scroll-to-zoom without page scroll** — React's `onWheel` attaches a passive listener by default, meaning `e.preventDefault()` is silently ignored and the browser scrolls the page. Fixed by using `useEffect` + `addEventListener('wheel', handler, { passive: false })` directly on the DOM node.

**Replace/Remove buttons** — Drag event handlers (`onDragOver`, `onDragEnter`) calling `e.preventDefault()` on the parent div blocked all child button clicks. Fixed by splitting the component into 3 separate render cases: empty state (has drag + click handlers), loading state (no handlers), and uploaded state (no handlers on the zone — buttons use plain `onClick`).

**Input always fires onChange** — A `key` prop on the hidden file input increments after every selection, forcing React to remount a fresh `<input>` element so the same file can be re-selected.

---

## 🎨 Design Choices

- **Industrial dark theme** — `#080c10` background with cyan (`#22d3ee`) and violet (`#a78bfa`) accents
- **Space Mono** — monospaced font for labels, badges, and technical UI elements
- **DM Sans** — clean sans-serif for body text and readable content
- **Animated circuit grid** — subtle background grid with floating glow orbs for depth
- **Skeleton loaders** — shimmer placeholders shown while mock API resolves
- **Micro-interactions** — hover states, selection highlights, staggered fade-up entry animations

---



## 📝 License

MIT — free to use and modify.
