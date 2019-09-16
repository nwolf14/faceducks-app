const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = require("../models/User");
const keys = require("./keys");

const opts: { jwtFromRequest?: string, secretOrKey?: string } = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport: any) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload: { id: string }, done: Function) => {
      User.findById(jwt_payload.id)
        .then((user: any) => {
          if (user) {
            return done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch((err: string) => console.log(err));
    })
  );
};
