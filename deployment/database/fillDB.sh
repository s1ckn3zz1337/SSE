mkdir /logs
nohup mongod > /logs/mongodb.log &
sleep 5
mongo < /installation/install.js
