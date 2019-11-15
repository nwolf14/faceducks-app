module.exports = function setEnvVariables() {
  const NODE_ENV = process.env.NODE_ENV;

  if (NODE_ENV === "qa") {
    process.env.PORT = '6200';
  }

  if (NODE_ENV === "prod") {
    process.env.PORT = '6200';
  }

  if (NODE_ENV === "local") {
    process.env.PORT = '5100';
  }
};
