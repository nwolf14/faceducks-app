const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../../controllers/UserController");

// @route POST /users/signup
// @desc Register new user
// @access Public
router.post("/signup", UserController.create);

// @route POST /users/signin
// @desc Login user / Return JWT
// @access Public
router.post("/signin", UserController.signIn);

// @route POST /users/current
// @desc Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  UserController.get
);

module.exports = router;
