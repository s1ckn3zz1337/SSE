db.createUser(
  {
    user: "admin",
    pwd: "1234",
    roles: [{ role: "root", db: "admin" }]
  }
)

db.createUser(
  {
    user: "headSupport",
    pwd: "headSupport",
    roles: [
      "backup",
      "restore"
    ]
  }
)