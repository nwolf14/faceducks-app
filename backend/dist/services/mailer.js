"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalAny = global;
const nodemailer = require('nodemailer');
const nodemailerConfig = require('../config/config').nodemailer;
globalAny.mailSender = nodemailer.createTransport(nodemailerConfig);
//# sourceMappingURL=mailer.js.map