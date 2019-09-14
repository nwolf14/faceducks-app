const User = require("../models/User");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

// Load input Validation
const validateSignUpInput = require("../validation/signup");
const validateSignInInput = require("../validation/signin");

const create = function(req, res) {
  const { isValid, errors } = validateSignUpInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const password = req.body.password;
  const email = req.body.email;
  const is_gdpr_accepted = req.body.isGdprAccepted;

  User.findOne({ email })
    .then(user => {
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
          is_gdpr_accepted
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                let mailOptions = {
                    from: '"Oddjobs" <oddjobs699@gmail.com>',
                    to: user.email,
                    subject: 'Activation account link',
                    html: `<a href="http://localhost:5001/api/users/activate/${user._id}">Activate account</a>`
                };
                
                mailSender.sendMail(mailOptions, (error, info) => {
                    if (error) return console.log(error);
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });

                return user;
              })
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
};

module.exports.create = create;

const signIn = function(req, res) {
  const { isValid, errors } = validateSignInInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        errors.email = "EMAIL_NOT_FOUND";
        return res.status(404).json({ errors });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
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
            (err, token) => {
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
    .catch(err => console.log(err));
};

module.exports.signIn = signIn;

const get = function(req, res) {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
};

module.exports.get = get;
