var requestjson = require('request-json');
var request = require('request');
var express = require('express');
var app = express();
var async = require ('async');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');

var webapp_env = {
    host: process.env.MY_WEBAPP_PORT_8888_TCP_ADDR || "localhost",
    port: process.env.MY_WEBAPP_PORT_8888_TCP_PORT || 8888
};

var myFile = {
    title: 'file3'  //,
   // content: 'my content'
};

// Make sure uploads directory exists                                                                                                                                                                     
var uploadDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

var webAppClient = requestjson.createClient("http://"+webapp_env.host+":"+webapp_env.port);   


function findAllFiles(callback){
        webAppClient.get('collectFiles/', function(err, res, body){
        if (err) throw (err); 
        var arrayOfFiles = JSON.parse(res.body);
        callback(null, arrayOfFiles) 
    });

}

function deleteAllFiles(myFile){
    
    webAppClient.post('removeFile/', myFile, function(err, res, body) {
    if (err) {
	    return console.log(err);
	}   
    return console.log(res.statusCode);

});

}

function processAllFiles(files){
    if (files.length>0){
         //  iterate over files
        for (var i = 0; i < files.length; i++){

             async.waterfall([
                 async.constant(files[i]),
                 collectFile,
                 createId,
                 storeDocInEs



                 // extract id, title, Text
                // store file in doc container
                 //  store file representaion in elasticsearch
             ])
        }
    } else {
        console.log("No files to upload");
    }
}

function createId(title, callback){
    callback(null, title, uuid.v4());
}

 function storeDocInEs(title, id){  
       console.log(title + "    " +id)
     var es_json = {
         id : id,
         title: title,
         text: "once apon a time"
    };

    webAppClient.post('upload_es/',es_json, function(err, res, body) {
        if (err) {
            return console.log(err);
        }   
        return console.log(res.statusCode);
    });

}
     
 
 
function collectFile(title, callback){
    request.get("http://"+webapp_env.host+":"+webapp_env.port+"/uploadedFiles/"+title).
    on('error', function(err) {
        console.log(err)
    })
    .pipe(fs.createWriteStream(path.join(uploadDir, title)))
    callback(null, title);
}

app.get('/run', function (req, res) {
  console.log("In batch run");

  async.waterfall([
      findAllFiles,
      processAllFiles
      //deletallfiles   

  ])

  res.send('done');
});




var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

    })