[1]: [https://www.mongodb.com/download-center#community]

## Unix Installation
1. Download and Install [MongoDB][1]
3. Start MongoDB service
```bash
sudo systemctl start mongodb
```
4. Connect to DB
```bash
mongo
```
5. create Admin User
```
use admin
db.createUser(
  {
    user: "admin",
    pwd: "<adminPassword>",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
exit
```
6. Edit MongoDB configuration to enable user authentication at /etc/mongodb.conf
```
[...]
auth=true
[...]
```
7. Restart MongoDB Service
```bash
sudo systemctl restart mongodb
```
8. Connect to DB
```bash
mongo
```
9. Authenticate as Admin
```
use admin
db.auth("admin", "<adminPassword>" )
```
10. create user for project database
```
use sse
db.createUser(
  {
    user: "sseuser",
    pwd: "Z2xQK8tASSDF8ZcU3XuSLzNY",
    roles: [ { role: "readWrite", db: "sse" } ]
  }
)
exit
```

## Docker Installation

1. Download Docker

```
https://docs.docker.com/
```

2. Pull the latest mongo image

```
docker pull mongo
```

3. Start database

```
docker run -p 27017:27017 --name sse-database -d mongo --auth
```

4. Add admin user

```
docker exec -it sse-database mongo admin
db.createUser({ user: 'admin', pwd: 'some-initial-password', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
db.auth('admin', 'some-initial-password');
```

5. Add DB user

```
use sse;
db.createUser(
  {
    user: "sseuser",
    pwd: "Z2xQK8tASSDF8ZcU3XuSLzNY",
    roles: [ { role: "readWrite", db: "sse" } ]
  }
);
exit;
```

## Windows Installation

1. Download and Install [MongoDB][1]
2. Go to the MongoSetup/Windows/Init folder
3. Run the scripts according to their numeration and follow the given instructions [Leave out X. unless you to reset the service]
4. After everything executed successfully please continue with the scripts in MongoSetup/Windows accordingly [X. is for convenience after the setup]



## Schemes

### User:
```
{
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  keyrings: [{type: Schema.Types.ObjectId, ref: "KeyRing"}]
}
```

### KeyRing:
```
{
  name: {type: String, required: true},
  description: {type: String, required: true},
  publicKey: {type: String, required: true},
  keyEntities: [{type: Schema.Types.ObjectId, ref: "KeyEntity"}]
}
```
### KeyEntity:
```
{
  keyName: {type: String, required: true},
  keyEncryptedPassword: {type: String, required: true},
  keyDescription: {type: String, required: true},
  keyURL: {type: String, required: true},
  keyUsername: {type: String, required: true}
}
```