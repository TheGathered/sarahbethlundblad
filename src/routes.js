import React from 'react';
import { Router, IndexRoute, Route, Redirect } from 'react-router';

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
      <Redirect from='/art' to='/art/page/1'/>
      <Redirect from='/illustration' to='/illustration/page/1'/>
      <Redirect from='/graphic-design' to='/graphic-design/page/1'/>
      <Route path="/:slug" component={SinglePost} />
      <Route path="/page/:page" component={List} />
      <Route path="/:cat/:slug" component={SinglePost} />
      <Route path="/:cat/page/:page" component={List} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);

export default Routes;