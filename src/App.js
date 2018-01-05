import React, { Component } from 'react';
import styles from './App.css';


import WebFont from 'webfontloader';

WebFont.load({
	google: {
		families: ['Source Code Pro', 'monospace']
	}
});


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