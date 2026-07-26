import React from 'react';
import ReactDOM from 'react-dom/client';
import HafidziApp from './HafidziApp';
import './index.css'; // Pastikan nama file CSS-nya sesuai, apakah index.css atau style.css?

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HafidziApp />
  </React.StrictMode>
);