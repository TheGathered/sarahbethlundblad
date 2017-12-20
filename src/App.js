import React, { Component } from 'react';
import styles from './App.css';

import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Ubuntu Mono:400', 'monospace']
  }
});


class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        {/*<div className="App-header">
          <h2>My blog</h2>
        </div>*/}
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;