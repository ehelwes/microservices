docker run --name my-running-app --link my-elastic-search:e-search -p 8888:8888 -d my-nodejs-app


#docker run --name some-kibana --link some-elasticsearch:elasticsearch -p 5601:5601 -d kibana

