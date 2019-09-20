export {};
const globalAny:any = global;
const nodemailer = require('nodemailer');
const nodemailerConfig = require('../config/config').nodemailer;
globalAny.mailSender = nodemailer.createTransport(nodemailerConfig);