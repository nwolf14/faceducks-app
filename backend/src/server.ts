export {};
require('./services/mailer');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const server = express();

const users = require("./routes/api/users");
const photos = require("./routes/api/photos");
const db = require("./config/keys").mongoURI;
const setEnvVariables = require("./config/env.js");

setEnvVariables();

server.use(bodyParser.json());
server.use(cors({ credentials: true, origin: true }));
server.options("*", cors({ credentials: true, origin: true }));
server.use(passport.initialize());
require("./config/passport")(passport);

mongoose
  .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err: string) => console.log(err));

server.use("/api/users", users);
server.use("/api", photos);

const port = process.env.PORT || 6200;

server.listen(port, () => console.log(`Server started on port ${port}`));
