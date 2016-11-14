'use strict';

// simple express server
var auth = require('http-auth');
var express = require('express');
var app = express();
var http = require('http');
var router = express.Router();
var bodyParser = require('body-parser');
var request = require('superagent');

var basic = auth.basic({
	realm: " ",
	file: "./htpasswd",
	authType: "basic"
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(auth.connect(basic));
app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

var mailchimpInstance   = 'us14',
    listUniqueId        = '5a39f7dd65',
    mailchimpApiKey     = '620cd4e6f4a44d5265f0d6489bda3412-us14';

app.post('/rsvped', function (req, res) {
	console.log('req.body');
	request
	  .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
	  .set('Content-Type', 'application/json;charset=utf-8')
	  .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
	  .send({
	    'email_address': req.body.email,
	    'status': 'subscribed',
	    'merge_fields': {
	      'FNAME': req.body.firstName,
	      'LNAME': req.body.lastName
	    }
	  })
    .end(function(err, response) {
      if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
        res.sendFile(__dirname + '/public/rsvped.html');
      } else {
      	console.log('signup failed');
      }
  });

});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
