
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var i=1;

app.use(express.static('public'));
app.use(express.static('pictures'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var connect = require('./connect.js');
var client = connect.client;
var stringify = require('json-stringify');


/*
client.ping({
	// ping usually has a 3000ms timeout 
	requestTimeout: Infinity,
 
	    // undocumented params are appended to the query string 
	    hello: "elasticsearch!"
	    }, function (error) {
	if (error) {
	    console.trace('elasticsearch cluster is down!');
	} else {
	    console.log('All is well');
	}
    });


client.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});
*/


 /* client.indices.create({  
  doctext: 'hej'
  },function(err,resp,status) {
    if(err) {
    console.log(err);
  }
  else {
    console.log("createDoc",resp);
  }
  });
}*/



function createDoc (str){
client.index({

  index: 'myindex',
  type: 'mytype',
 // id: i++,
  body: {
    title: str,
    published_at: '2013-01-01',
  }
  
}, function (error, response) {
  console.log("createDoc", response);
});
}


//Find tweets that have "elasticsearch" in their body field
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
        console.log("title: "+hit._source.title);
      })
      

    }
});
}




app.get('/',function(req,res){
  res.sendfile("index.html");
});


app.get('/search',function(req,res){
  res.sendfile("search.html");
});

app.post('/upload',function(req,res){
	console.log("in upload");
  var uploadstring=req.body.uploadstring;
  console.log("Upload string="+uploadstring);
  createDoc(uploadstring);
  res.end("done");
});

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