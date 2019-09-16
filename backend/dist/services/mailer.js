"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalAny = global;
const nodemailer = require('nodemailer');
const config = require('../config/config').config.nodemailer;
globalAny.mailSender = nodemailer.createTransport(config);
//# sourceMappingURL=mailer.js.map