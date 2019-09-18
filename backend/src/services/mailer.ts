export {};
const globalAny:any = global;
const nodemailer = require('nodemailer');
const config = require('../config/config').config.nodemailer;
globalAny.mailSender = nodemailer.createTransport(config);