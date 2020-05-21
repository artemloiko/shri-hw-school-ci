import React, { useEffect } from 'react';
import { Router } from '@reach/router';
import { useToasts } from 'react-toast-notifications';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Details from './pages/Details/Details';
import ErrorPage from './pages/ErrorPage/ErrorPage';

function App() {
  const { addToast } = useToasts();
  useEffect(() => {
    const networkChangeHandler = () => {
      const message = navigator.onLine
        ? 'App is online. Reload page to get latest data.'
        : 'App is offline. Last loaded data is shown.';
      addToast(message, { appearance: 'info', autoDismiss: navigator.onLine });
    };
    window.addEventListener('online', networkChangeHandler);
    window.addEventListener('offline', networkChangeHandler);
    return () => {
      window.removeEventListener('online', networkChangeHandler);
      window.removeEventListener('offline', networkChangeHandler);
    };
  }, [addToast]);
  return (
    <Router>
      <Home path="/" />
      <Settings path="settings" />
      <Details path="details/:buildId" />
      <ErrorPage default />
    </Router>
  );
}

export default App;
