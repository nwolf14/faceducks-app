import { IUser } from "../interfaces";
export {};
const User = require("../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { host, frontHost } = require("../config");
const keys = require("../config/keys");
const validateSignUpInput = require("../validation/signup");
const validateSignInInput = require("../validation/signin");
const { getByUserNameSerializer } = require("../serializers/users");

const create = function(req: any, res: any) {
  const { isValid, errors } = validateSignUpInput(req.body);
  const { password, email, userName } = req.body;

  if (!isValid) {
    return res.status(400).json({ errors });
  }

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
          avatar,
          userName
        });

        bcrypt.genSalt(10, (err: string, salt: string) => {
          bcrypt.hash(password, salt, (err: string, hash: string) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then((user: any) => {
                const anyGlobal: any = global;
                const { mailSender } = anyGlobal;
                const mailOptions = {
                  from: '"Faceducks" <nwolf960@gmail.com>',
                  to: user.email,
                  subject: "Activation your account",
                  html: `<a href="${host}/api/users/activate/${user._id}">Use this link to activate your account</a>`
                };

                mailSender.sendMail(mailOptions, (error: any, info: any) => {
                  if (error) return console.log(error);
                  console.log("Message sent: %s", info.messageId);
                  console.log(
                    "Preview URL: %s",
                    nodemailer.getTestMessageUrl(info)
                  );
                });

                return user;
              })
              .then((user: any) => res.json({ success: true, user }))
              .catch((err: any) =>
                res.status(400).json({ error: err.message })
              );
          });
        });
      }
    })
    .catch((err: any) => res.status(500).json({ error: err.message }));
};

module.exports.create = create;

const signIn = function(req: any, res: any) {
  const { isValid, errors } = validateSignInInput(req.body);
  const { email, password } = req.body;

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ email })
    .then((user: IUser) => {
      if (!user) {
        errors.email = "EMAIL_NOT_FOUND";
        return res.status(404).json({ errors });
      }

      if (!user.is_mail_confirmed) {
        errors.email = "EMAIL_NOT_CONFIRMED";
        return res.status(400).json({ errors });
      }

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
            (err: string, token: string) =>
              res.json({ success: true, token: "Bearer " + token })
          );
        } else {
          errors.password = "PASSWORD_INCORRECT";
          return res.status(400).json({ errors });
        }
      });
    })
    .catch((err: any) => res.status(500).json({ error: err.message }));
};

module.exports.signIn = signIn;

const activate = function(req: any, res: any) {
  const { userId } = req.params;
  if (userId) {
    User.findOneAndUpdate(
      { _id: userId },
      { is_mail_confirmed: true },
      { useFindAndModify: true }
    )
      .then(() => {
        res.set("Content-Type", "text/html");
        res.send(
          new Buffer(`
          <div style='height: 100%; text-align: center;'>
            <h3>Account activated :)</h3>
            <a href="${frontHost}">Click here to go back to the faceducks.com website</a>
          </div>
        `)
        );
      })
      .catch((err: any) => res.status(404).json({ error: err.message }));
  } else {
    res.status(400).json({ error: "MISSING_ID_PARAM" });
  }
};

module.exports.activate = activate;

const getByUserName = function(req: any, res: any) {
  const { userName } = req.params;
  if (userName) {
    User
      .find({ userName: new RegExp(userName) }, null, { limit: 50 })
      .then((results: Array<IUser>) => {
        res.json({ results: results.map((result: IUser) => getByUserNameSerializer(result)) });
      })
      .catch((err: any) => res.status(404).json({ error: err.message }));
  } else {
    res.status(400).json({ error: "MISSING_USER_NAME" });
  }
};

module.exports.getByUserName = getByUserName;

const get = function(req: any, res: any) {
  res.json({
    id: req.user.id,
    userName: req.user.userName,
    email: req.user.email
  });
};

module.exports.get = get;
