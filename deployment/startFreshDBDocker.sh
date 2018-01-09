#!/usr/bin/env bash
docker stop sse-database
docker rm sse-database
rm -r ./database/sse_mongodb
mkdir ./database/sse_mongodb
docker run -p 27017:27017 --name sse-database -v $PWD/database/sse_mongodb:/data/db -d mongo --auth
docker exec -i sse-database mongo < $PWD/database/mongoDBCreation.js