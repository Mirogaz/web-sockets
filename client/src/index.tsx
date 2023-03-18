import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SocketContextComponent from './component/SocketContextComponent';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <SocketContextComponent>
      <React.StrictMode>
        <App />
      </React.StrictMode>
  </SocketContextComponent>
);

reportWebVitals();
