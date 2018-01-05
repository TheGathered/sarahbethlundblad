import React, { Component } from 'react';
import styles from './App.css';
import WebFont from 'webfontloader';


var MobileDetect = require("mobile-detect");
var md = new MobileDetect(window.navigator.userAgent);

WebFont.load({
  google: {
    families: ['Source Code Pro', 'monospace']
  }
});

if (md.phone()) {
  require("./css/mobile.css");
  window.document.body.className = [...window.document.body.className.split(' '), 'isMobile'].join(' ');
}

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;