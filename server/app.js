// server/app.js
const express = require('express');
const path = require('path');
const apicache = require('apicache');
const redis = require('redis');

const app = express();
const config = require('../src/config');

// var redis = require('redis');
var requestProxy = require('express-request-proxy');

// require('redis-streams')(redis);
let cache = apicache.options({
		debug : true,
		// redisClient: redis.createClient()
}).middleware;

app.use(cache('1 day'))

app.get('/wp-json/:type?/:version?/:resource?/:id?', requestProxy({
		// cache: redis.createClient(),
		cache: false,
		url: config.endpoint+"/:type?/:version?/:resource?/:id?",
		headers: {
				'Access-Control-Allow-Origin': '*'
		}
}));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;