module.exports = {
  mongoURI:
    process.env.NODE_ENV === "local-debug"
      ? "mongodb://norbi:norbi123@localhost:27015/faceducks"
      : "mongodb://norbi:norbi123@mongodb:27015/faceducks",
  secretOrKey: "secret"
};
