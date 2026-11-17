import { hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// index.html carries the pre-rendered page (scripts/prerender.js); a lens or device that renders differently
// makes React log a recoverable mismatch and render on the client instead
hydrateRoot(document.getElementById("root")!, <App />);
