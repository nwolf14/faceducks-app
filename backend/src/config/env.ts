module.exports = function setEnvVariables() {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === "development") {
    process.env.PORT = '6200';
  }

  if (NODE_ENV === "production") {
    process.env.PORT = '6200';
  }

  if (NODE_ENV === "local-debug") {
    process.env.PORT = '5100';
  }
};
