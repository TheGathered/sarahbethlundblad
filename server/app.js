// server/app.js
const express = require("express");
const path = require("path");
const apicache = require("apicache");
const redis = require("redis");
const sm = require("sitemap");

const app = express();
const config = require("../src/config");

// var redis = require('redis');
var requestProxy = require("express-request-proxy");

console.log(process.env.NODE_ENV !== "production");
// require('redis-streams')(redis);
var cache = apicache.options({
  debug: process.env.NODE_ENV !== "production"
  // redisClient: redis.createClient()
}).middleware;

var sitemap = sm.createSitemap({
  hostname: "http://sarah-beth.co.uk",
  cacheTime: 600000, // 600 sec - cache purge period
  urls: [
    { url: "/", changefreq: "weekly", priority: 0.9 },
    { url: "/illustration/", changefreq: "weekly", priority: 0.7 },
    { url: "/art/", changefreq: "weekly", priority: 0.8 },
    { url: "/graphic-design/", changefreq: "monthly", priority: 0.6 }
  ]
});

if (process.env.NODE_ENV === "production") app.use(cache("1 hour"));
else app.use(cache("1 minute"));

app.get("/sitemap.xml", function(req, res) {
  sitemap.toXML(function(err, xml) {
    if (err) {
      return res.status(500).end();
    }
    res.header("Content-Type", "application/xml");
    res.send(xml);
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get(
  "/wp-json/:type?/:version?/:resource?/:id?",
  requestProxy({
    cache: false,
    url: config.endpoint + "/:type?/:version?/:resource?/:id?"
  })
);

// Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

module.exports = app;
