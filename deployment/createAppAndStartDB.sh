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
