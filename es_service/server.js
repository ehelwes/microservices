
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var upload = multer({dest: 'upload/'});
var path = require('path');
var app = express();
var fs = require('fs');
var type = upload.single('uploadfile');
var i=1;

app.use(express.static('public'));
app.use(express.static('pictures'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var connect = require('./connect.js');
var client = connect.client;
var stringify = require('json-stringify');


  // Make sure uploads directory exists                                                                                                                                                                     
var uploadDir = path.join(__dirname, '/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}






var ex_json = {
  id : 1234,
  title: "hej",
  text: "once apon a time"
};


//called from webpage
//put file in tmp folder
app.post('/upload',type, function(req,res){
	console.log("in upload");

  var tmp_path = req.file.path;
 
  var src = fs.createReadStream(tmp_path);

  var destpath = path.join(uploadDir, req.file.originalname);
  var dest = fs.createWriteStream(path.join(uploadDir, req.file.originalname));
  src.pipe(dest);
  src.end;
  res.end("done");
 
  
});

//called from batch
app.post('/upload_es',function(req,res){
	console.log("in upload_es");
  var uploaditem=ex_json;
  createDoc(uploaditem);
  res.end("done");
});

//TODO: to be removed
app.post('/test',function(req,res){
  	console.log("********** in test!!!!!!!");

  res.json({ user: 'tobi' });
    
});




//called from webpage
//load index.html
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname, "/index.html"));
});


//called from webpage
//load search.html
app.get('/search',function(req,res){
  res.sendFile(path.join(__dirname, "/search.html"));
});


//called from web page
app.post('/search/docs',function(req,res){
	console.log("in search/doc");
    var searchstring = req.body.searchstring;
    console.log("Search string="+searchstring);
    searchDoc(searchstring, res);
    res.end("done");
});


app.listen(8888,function(){
  console.log("Started on PORT 8888");
})


//create in es
function createDoc (item){
client.index({

  index: 'myindex',
  type: 'mytype',
  body: {
    id: item.id,
    title: item.title,
    text: item.text
  }
  
}, function (error, response) {
  console.log("createDoc", response);
});
}


//search in es
function searchDoc (str) {
client.search({ 

 index: 'myindex',
 q: 'title:'+str
},function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log(response);
      console.log("--- Hits ---");
      response.hits.hits.forEach(function(hit){
        console.log(hit);
        console.log("json: "+JSON.stringify(hit._source));
      })
      

    }
});
}