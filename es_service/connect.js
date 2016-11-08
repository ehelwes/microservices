var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {  
    host: '172.17.0.1:9200'   //,
//	log: 'trace'
});


exports.client = client;

