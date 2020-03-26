import React from 'react';
import { Router } from '@reach/router';
import Home from './pages/Home/Home';
import Settings from './pages/Settings/Settings';
import History from './pages/History/History';
import Details from './pages/Details/Details';

function App() {
  return (
    <Router>
      <Home path="/" />
      <Settings path="settings" />
      <History path="history" />
      <Details path="details/:buildNumber" />
    </Router>
  );
}

export default App;
