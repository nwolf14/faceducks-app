"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = require("../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { host, frontHost } = require("../config");
const keys = require("../config/keys");
const validateSignUpInput = require("../validation/signup");
const validateSignInInput = require("../validation/signin");
const create = function (req, res) {
    const { isValid, errors } = validateSignUpInput(req.body);
    const { password, email, userName } = req.body;
    if (!isValid) {
        return res.status(400).json({ errors });
    }
    User.findOne({ email })
        .then((user) => {
        if (user) {
            errors.email = "EMAIL_EXISTS";
            return res.status(400).json({ errors });
        }
        else {
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm" // Default
            });
            const newUser = new User({
                password,
                email,
                avatar,
                userName
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err)
                        throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then((user) => {
                        const anyGlobal = global;
                        const { mailSender } = anyGlobal;
                        const mailOptions = {
                            from: '"Faceducks" <nwolf960@gmail.com>',
                            to: user.email,
                            subject: "Activation your account",
                            html: `<a href="${host}/api/users/activate/${user._id}">Use this link to activate your account</a>`
                        };
                        mailSender.sendMail(mailOptions, (error, info) => {
                            if (error)
                                return console.log(error);
                            console.log("Message sent: %s", info.messageId);
                            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        });
                        return user;
                    })
                        .then((user) => res.json({ success: true, user }))
                        .catch((err) => res.status(400).json({ error: err.message }));
                });
            });
        }
    })
        .catch((err) => res.status(500).json({ error: err.message }));
};
module.exports.create = create;
const signIn = function (req, res) {
    const { isValid, errors } = validateSignInInput(req.body);
    const { email, password } = req.body;
    if (!isValid) {
        return res.status(400).json({ errors });
    }
    User.findOne({ email })
        .then((user) => {
        if (!user) {
            errors.email = "EMAIL_NOT_FOUND";
            return res.status(404).json({ errors });
        }
        if (!user.is_mail_confirmed) {
            errors.email = "EMAIL_NOT_CONFIRMED";
            return res.status(400).json({ errors });
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User Matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar
                };
                // Sign token
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => res.json({ success: true, token: "Bearer " + token }));
            }
            else {
                errors.password = "PASSWORD_INCORRECT";
                return res.status(400).json({ errors });
            }
        });
    })
        .catch((err) => res.status(500).json({ error: err.message }));
};
module.exports.signIn = signIn;
const activate = function (req, res) {
    const { userId } = req.params;
    if (userId) {
        User.findOneAndUpdate({ _id: userId }, { is_mail_confirmed: true }, { useFindAndModify: true })
            .then(() => {
            res.set("Content-Type", "text/html");
            res.send(new Buffer(`
          <div style='height: 100%; text-align: center;'>
            <h3>Account activated :)</h3>
            <a href="${frontHost}">Click here to go back to the faceducks.com website</a>
          </div>
        `));
        })
            .catch((err) => res.status(404).json({ error: err.message }));
    }
    else {
        res.status(400).json({ error: "MISSING_ID_PARAM" });
    }
};
module.exports.activate = activate;
const get = function (req, res) {
    res.json({
        id: req.user.id,
        userName: req.user.userName,
        email: req.user.email
    });
};
module.exports.get = get;
//# sourceMappingURL=UserController.js.map