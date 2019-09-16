"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const server = express();
// Set environment variables
const setEnvVariables = require("./config/env.js");
setEnvVariables();
// Bodyparser Middleware
server.use(bodyParser.json());
// Cors Middleware
server.use(cors({ credentials: true, origin: true }));
server.options("*", cors({ credentials: true, origin: true }));
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to Mongo
mongoose
    .connect(db)
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));
// Passport middleware
server.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);
// Use Routes
const users = require("./routes/api/users");
server.use("/api/users", users);
const port = process.env.PORT || 6200;
server.listen(port, () => console.log(`Server started on port ${port}`));
//# sourceMappingURL=server.js.map