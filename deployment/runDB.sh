docker stop sse-database
docker rm sse-database
docker run -p 27017:27017 --name sse-database -v $PWD/database/sse_mongodb:/data/db -d sse:mongodb