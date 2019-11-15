const webSocketServer = require("websocket").server;
const axios = require("axios");
const { backendUrl, frontendUrl } = require("config");
const { creatMessagesKeyForTwoUsers } = require("./helpers");

const clients = [];
const clientsMap = {};
const messagesMap = {};

const wsServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: global.appServer
});

wsServer.on("request", function(request) {
  console.log(new Date() + " Connection from origin " + request.origin + ".");

  let userName = false;
  let connection;

  if (request.origin !== frontendUrl) {
    request.reject();
    console.log(new Date() + " Connection from origin " + request.origin + " refused." + process.env.NODE_ENV);

    return;
  } else {
    connection = request.accept(null, request.origin);
  }

  console.log(new Date() + " Connection accepted.");

  // if (history.length > 0) {
  //   connection.sendUTF(JSON.stringify({ type: "history", data: history }));
  // }

  connection.on("message", async function(message) {
    if (message.type === "utf8") {
      const parsedMessageData = JSON.parse(message.utf8Data);
      const { from, to, type } = parsedMessageData;
      const usersMessagesKey = creatMessagesKeyForTwoUsers(from, to);

      if (type === "onopen") {
        if (!messagesMap[usersMessagesKey]) {
          messagesMap[usersMessagesKey] = [];
        }
        let result;
        try {
          result = await axios.get(`http://backend:6200/api/photos`);
        } catch (e) {
          console.log(e);
        }
        console.log(result);
        clientsMap[from] = connection;
        userName = from;
      } else {
        parsedMessageData.date = new Date().getTime();

        messagesMap[usersMessagesKey].push(parsedMessageData);
        messagesMap[usersMessagesKey] = messagesMap[usersMessagesKey].slice(-100);

        if (clientsMap[to]) {
          clientsMap[to].sendUTF(JSON.stringify(parsedMessageData));
        }

        console.log(messagesMap);
      }
    }
  });

  connection.on("close", function(connection) {
    if (userName !== false) {
      console.log(new Date() + " Peer " + connection.remoteAddress + " disconnected.");

      clients.splice(index, 1);
      delete clientsMap[userName];

      console.log(clientsMap);
    }
  });
});
