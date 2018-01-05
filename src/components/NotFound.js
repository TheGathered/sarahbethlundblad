// components/NotFound.js
import React from 'react';
import {Helmet} from "react-helmet";

const NotFound = (...props) =>

	<div className="App">
		<Helmet >
				<meta charSet="utf-8" />
				<title>404 page not found</title>
				<link rel="next" href="/" />
		</Helmet>
					<div>
						<h1>404: page not found</h1>
						<p>We are sorry but the page you are looking for does not exist.</p>
					</div>
	</div>


export default NotFound;