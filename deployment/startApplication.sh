#!/usr/bin/env bash
docker stop sse-keyring
docker rm sse-keyring
docker run -p 443:443 -p 80:80 --name sse-keyring --link sse-database:mongo -d sse/node-web-app