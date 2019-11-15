process.title = "node-chat";

const http = require("http");
const { webSockerServerPort } = require("config");

const server = http.createServer(function(request, response) {});
server.listen(webSockerServerPort, function() {
  console.log(
    new Date() + " Server is listening on port " + webSockerServerPort
  );
});

global.appServer = server; 

require("./app");
