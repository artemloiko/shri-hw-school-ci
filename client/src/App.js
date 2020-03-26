import React from 'react';
import { Router } from '@reach/router';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import Details from './pages/Details/Details';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Router>
      <Home path="/" />
      <Settings path="settings" />
      <Details path="details/:buildNumber" />
      <NotFound default />
    </Router>
  );
}

export default App;
