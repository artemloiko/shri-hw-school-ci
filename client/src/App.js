import React from 'react';
import { Router } from '@reach/router';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Details from './pages/Details/Details';
import ErrorPage from './pages/ErrorPage/ErrorPage';

function App() {
  return (
    <Router>
      <Home path="/" />
      <Settings path="settings" />
      <Details path="details/:buildNumber" />
      <ErrorPage default />
    </Router>
  );
}

export default App;
