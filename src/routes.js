import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';

import App from './App';
import List from './pages/List';
import Single from './pages/Single';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App}>
      <IndexRoute component={List} />
      <Route path="/:slug" component={Single} />
    </Route>
  </Router>
);

export default Routes;