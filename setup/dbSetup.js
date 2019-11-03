db.getSiblingDB('admin').createUser({
  user: 'root',
  pwd: 'test1234',
  roles: [{ role: 'root', db: 'admin' }]
});

db.createCollection("users");
db.createCollection("photos");
db.createUser({
  user: 'norbi',
  pwd: 'norbi123',
  roles: ['readWrite', 'userAdmin']
});
db.users.insert({"dupa": "dupa2"});