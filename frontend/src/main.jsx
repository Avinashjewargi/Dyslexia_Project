// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// React Router
import { BrowserRouter } from 'react-router-dom';

// i18n configuration
import '../config/i18nConfig';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
