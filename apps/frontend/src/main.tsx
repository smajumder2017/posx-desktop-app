// import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { ThemeProvider } from './components/theme-provider.tsx';
import './index.css';
import store from './redux/store.ts';
import { Toaster } from './components/ui/toaster.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <App />
      <Toaster />
    </ThemeProvider>
  </Provider>,
  // </React.StrictMode>,
);
