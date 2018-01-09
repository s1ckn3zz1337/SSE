use admin;
db.createUser({ user: 'admin', pwd: 'PLEASE CHANGE ME', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });
db.auth('admin', 'PLEASE CHANGE ME');
use sse;
db.createUser(
    {
        user: "sseuser",
        pwd: "Z2xQK8tASSDF8ZcU3XuSLzNY",
        roles: [ { role: "readWrite", db: "sse" } ]
    }
);
exit