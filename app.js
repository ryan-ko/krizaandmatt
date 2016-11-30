'use strict';

// simple express server
var auth = require('http-auth');
var express = require('express');
var app = express();
var http = require('http');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('superagent');
// var basicAuth = require('basic-auth-connect');
var fs = require('fs');

var basic = auth.basic({
	realm: " ",
	file: "./htpasswd",
	authType: "basic"
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(auth.connect(basic));
app.use(express.static('public'));

// Synchronous
// var auth = basicAuth('ryanko', '144');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

var mailchimpInstance   = 'us14',
		listUniqueId        = '5a39f7dd65',
		mailchimpApiKey     = '620cd4e6f4a44d5265f0d6489bda3412-us14';

app.post('/rsvped', function (req, res) {
	request
		.post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
		.set('Content-Type', 'application/json;charset=utf-8')
		.set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
		.send({
			'email_address': req.body.email,
			'status': 'subscribed',
			'merge_fields': {
				'NAME': req.body.firstname,
				'PO': req.body.plusone,
				'PONAME': req.body.plusonename
			}
		})
		.end(function(err, response) {
			if (response.status < 300) {
				res.send(JSON.stringify({ result: 'success' }));
			} else if (response.status === 400 && response.body.title === 'Member Exists') {
				res.send(JSON.stringify({ result: 'rsvp_existed' }));
			} else {
				res.send(JSON.stringify({ result: 'error' }));
			}
		}
	);
});

app.post('/login', function (req, res) {
	var password = req.body.password;
	if (password.toString() === '12345') {
		var markup = fs.readFileSync(__dirname + '/private/views/core.html', 'utf8');
		var menuMarkup = fs.readFileSync(__dirname + '/private/views/menu.html', 'utf8');
		res.send(JSON.stringify({ result: 'success', html: markup, menuHtml: menuMarkup }));
	} else {
		res.send(JSON.stringify({ result: 'failed' }));
	}
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
