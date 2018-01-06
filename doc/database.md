[1]: [https://www.mongodb.com/download-center#community]

## Installation
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

## Docker Installation of the DB:

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
## Scheme

### User:
```
{
    _id: <ObjectId>,
    username: String,
    email: String,
    password: String,
    keyrings: [keyring]
}
```

### KeyRing:
```
{
   _id: <ObjectID>,
   keyEntities: [keyEntity]
}
```
### KeyEntity:
```
{
    _id: <ObjectId>,
    keyName: String,
    keyEncryptedPassword: String,
    keyDescription: String,
    keyURL: String
}
```