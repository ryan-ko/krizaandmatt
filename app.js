'use strict';

// simple express server
var auth = require('http-auth');
var express = require('express');
var app = express();
var http = require('http');
var router = express.Router();

var basic = auth.basic({
	realm: " ",
	file: "./htpasswd",
	authType: "basic"
});

app.use(auth.connect(basic));

app.use(express.static('public'));
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
