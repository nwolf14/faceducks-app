const nodemailer = require('nodemailer');
const config = require('../config/config').config.nodemailer;
global.mailSender = nodemailer.createTransport(config);
