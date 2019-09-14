db.createCollection("users");
db.createCollection("photos");
db.createUser({
  user: "norbi",
  pwd: "norbi123",
  roles: ["readWrite", "dbAdmin"]
});
