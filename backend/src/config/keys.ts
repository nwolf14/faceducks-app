module.exports = {
  mongoURI:
    process.env.NODE_ENV === "local-debug"
      ? "mongodb://localhost:27010,localhost:27011,localhost:27012/test?replicaSet=rs0"
      : "mongodb://mongo-rs0-1:27010,mongo-rs0-2:27011mongo-rs0-3:27012/test?replicaSet=rs0",
  secretOrKey: "secret"
};
