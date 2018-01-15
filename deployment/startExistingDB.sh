#!/usr/bin/env bash
docker stop sse-database
docker rm sse-database
if [ -d "./database/sse_mongodb" ]; then
    docker run -p 27017:27017 --name sse-database -v $PWD/database/sse_mongodb:/data/db -d mongo --auth
else
    echo "COULD NOT START DATABASE, DATABASE DIRECTORY NON EXISTENT"
fi
