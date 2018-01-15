#!/usr/bin/env bash
cd ./../
echo "create javascript sources"
npm install
gulp deploy
rm -r ./deployment/application/build
cp -R ./build ./deployment/application/build
cd ./deployment
rm -r ./application/package.json
rm -r ./application/package-lock.json
cp ./../package.json ./application/package.json
cp ./../package-lock.json ./application/package-lock.json

cd ./application/
docker build -t sse/node-web-app .
cd ../
./startFreshDBDocker.sh
cd ./application/
docker stop sse-keyring
docker rm sse-keyring
docker run -p 443:443 -p 80:80 --name sse-keyring --link sse-database:mongo -d sse/node-web-app