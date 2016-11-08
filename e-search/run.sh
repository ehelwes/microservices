
docker run -d -p 9200:9200 -p 9300:9300 --name=my-elastic-search elasticsearch:2 -Des.network.host=0.0.0.0


#docker run -d --name es -p 9200:9200 elasticsearch:2 -Des.network.host=0.0.0.0