// Render may start the service from `backend/index.js` depending on Start Command.
// Keep this tiny shim so `node index.js` works after `npm run build` produces `dist/`.
import './dist/index.js';

