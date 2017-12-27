db.auth("admin", "1234");
db = db.getSiblingDB("sse");
db.createUser(
  {
    user: "sseuser",
    pwd: "Z2xQK8tASSDF8ZcU3XuSLzNY",
    roles: [{ role: "readWrite", db: "sse" }]
  }
);