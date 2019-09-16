import { RequestHandler } from "express-serve-static-core";

export {};
const User = require("../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input Validation
const validateSignUpInput = require("../validation/signup");
const validateSignInInput = require("../validation/signin");

const create = function(req: any, res: any) {
  const { isValid, errors } = validateSignUpInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const password = req.body.password;
  const email = req.body.email;

  User.findOne({ email })
    .then((user: any) => {
      if (user) {
        errors.email = "EMAIL_EXISTS";
        return res.status(400).json({ errors });
      } else {
        const avatar = gravatar.url(email, {
          s: "200", // Size
          r: "pg", // Rating
          d: "mm" // Default
        });

        const newUser = new User({
          password,
          email,
          avatar
        });

        bcrypt.genSalt(10, (err: string, salt: string) => {
          bcrypt.hash(password, salt, (err: string, hash: string) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then((user: any) => {
                // let mailOptions = {
                //     from: '"Oddjobs" <oddjobs699@gmail.com>',
                //     to: user.email,
                //     subject: 'Activation account link',
                //     html: `<a href="http://localhost:5001/api/users/activate/${user._id}">Activate account</a>`
                // };
                
                // mailSender.sendMail(mailOptions, (error, info) => {
                //     if (error) return console.log(error);
                //     console.log('Message sent: %s', info.messageId);
                //     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                // });

                return user;
              })
              .then((user: any) => res.json(user))
              .catch((err: string) => console.log(err));
          });
        });
      }
    })
    .catch((err: string) => console.log(err));
};

module.exports.create = create;

const signIn = function(req: any, res: any) {
  const { isValid, errors } = validateSignInInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then((user: any) => {
      // Check for user
      if (!user) {
        errors.email = "EMAIL_NOT_FOUND";
        return res.status(404).json({ errors });
      }

      // Check password
      bcrypt.compare(password, user.password).then((isMatch: boolean) => {
        if (isMatch) {
          // User Matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            email: user.email,
            avatar: user.avatar
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err: string, token: string) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          errors.password = "PASSWORD_INCORRECT";
          return res.status(400).json({ errors });
        }
      });
    })
    .catch((err: string) => console.log(err));
};

module.exports.signIn = signIn;

const get = function(req: any, res: any) {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};

module.exports.get = get;
