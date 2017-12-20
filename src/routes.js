import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';

import ReactGA from 'react-ga';


import App from './App';
import List from './pages/List';
import SinglePost from './pages/Single';
// import SinglePage from './pages/Single';
import NotFound from './components/NotFound';

ReactGA.initialize('UA-1360554-9');

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App}>
      <IndexRoute component={List} />
      <Route path="/:slug" component={SinglePost} />
      <Route path="/page/:page" component={List} />
      <Route path="/:cat/:slug" component={SinglePost} />
      <Route path="/:cat/page/:page" component={List} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;