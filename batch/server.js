var request = require('request-json');
var express = require('express');
var app = express();

var webapp_env = {
    host: process.env.MY_WEBAPP_PORT_8888_TCP_ADDR || "localhost",
    port: process.env.MY_WEBAPP_PORT_8888_TCP_PORT || 8888
};


//var webapp_url = "my-webapp:8888/";   


//var client = request.createClient(webapp_url);
 var client = request.createClient("http://"+webapp_env.host+":"+webapp_env.port);

var data = {
    title: 'my title',
    content: 'my content'
};

client.post('test/', data, function(err, res, body) {
	console.log("in batch test");
	if (err) {
	    return console.log(err);
	}
	console.log("hej");
	return console.log(res.statusCode);
    });


app.get('/run', function (req, res) {
  console.log("In batch run");
  res.send('done');
});


//Check if file in uploads

/*
fs = require('fs')
fs.readFile('/etc/hosts', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});
*/

//collect title
//create id from title
//extract text
//send to document container with id
//store in es with title, id and text


var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

    })