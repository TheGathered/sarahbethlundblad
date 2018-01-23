// server/app.js
const express = require("express");
const path = require("path");
const apicache = require("apicache");
const sm = require("sitemap");
const app = express();
const config = require("./config");
const requestProxy = require("express-request-proxy");
const expressRobotsMiddleware = require("express-robots-middleware");
const basicAuth = require("basic-auth");
const WPAPI = require("wpapi");

console.log(process.env.NODE_ENV);
// var redis = require("redis");
// require("redis-streams")(redis);
var cache = apicache.options({
  debug: process.env.NODE_ENV !== "production"
  // redisClient: redis.createClient()
}).middleware;

const robotsMiddleware = expressRobotsMiddleware({
  UserAgent: "*",
  Disallow: ["/preview","/wp-json"],
  Noindex: ["/preview","/wp-json"],
  Allow: "/",
  CrawlDelay: "5"
});

var auth = function(req, res, next) {
  if (process.env.NODE_ENV === "production") return next();
  function unauthorized(res) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    return res.send(401);
  }
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === config.httpAuth.user && user.pass === config.httpAuth.pass) {
    return next();
  } else {
    return unauthorized(res);
  }
};


var sitemap = sm.createSitemap({
  hostname: "https://sarah-beth.co.uk",
  cacheTime: 600000, // 600 sec - cache purge period
  urls: [
    { url: "/", changefreq: "weekly", priority: 0.9 },
    { url: "/illustration/", changefreq: "weekly", priority: 0.7 },
    { url: "/art/", changefreq: "weekly", priority: 0.8 },
    { url: "/graphic-design/", changefreq: "monthly", priority: 0.6 }
  ]
});

if (process.env.NODE_ENV === "production") app.use(cache("1 day"));
else {
  app.use(function(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });
  // app.use(auth);

}

app.get("/robots.txt", robotsMiddleware);

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
  // if (process.env.NODE_ENV !== "production") {
  //   res.header("Access-Control-Allow-Origin", "*")
  // }
  // else {
  //   var allowedOrigins = ["https://sarah-beth.co.uk", "https://sarah-beth.net" ];
  //   var origin = req.headers.origin;
  //   if (allowedOrigins.indexOf(origin) > -1) {
  //     res.setHeader("Access-Control-Allow-Origin", origin);
  //   }
  // }
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

//TODO: figure out how to use Nounce cookies for cross domain CORS

app.get("/api/preview", (req, res) => {
  wp = new WPAPI({
    endpoint: config.preview,
    auth: false
  });
  if (!req.query.p) return res.status(400);
  return wp
    .posts()
    .id(req.query.p)
    .auth({ username: config.wpAuth.user, password: config.wpAuth.pass })
    .param({
      status: "draft"
    })
    .embed()
    .then(
      posts => {
        return res.json({ posts });
      },
      err => {
        return res.status(err.data.status);
      }
    );
});

var proxy;
if (process.env.NODE_ENV === "production"){
  proxy = {
    cache: false,
    url: config.endpoint + "/:type?/:version?/:resource?/:id?"
  }
}
else {
  proxy = {
    cache: false,
    url: config.endpoint + "/:type?/:version?/:resource?/:id?",
    headers: {
        Authorization: "Basic " + new Buffer(config.wpAuth.user + ":" + config.wpAuth.pass).toString('base64')
    }
  }
}

app.get(
  "/api/:type?/:version?/:resource?/:id?",
  requestProxy(proxy)
);

app.get('/test', (req, res)=> {
  return  res.send('ok');
})

app.post('/test', (req, res)=> {
  return res.status(200);
})

// Serve static assets
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.get("/preview", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

app.get("*", (req, res) => {
  return res.sendFile(path.resolve(__dirname, "..", "build", "index.html"));
});

module.exports = app;
