export {};
const express = require("express");
const router = express.Router();
const passport = require("passport");

const UserController = require("../../controllers/UserController");

// @route POST /users/signup
// @desc Register new user
// @access Public
router.post("/signup", UserController.create);

// @route GET /users/activate
// @desc Activate new registered user
// @access Public
router.get("/activate/:userId", UserController.activate);

// @route POST /users/signin
// @desc Login user / Return JWT
// @access Public
router.post("/signin", UserController.signIn);

// @route GET /users/getByUserName
// @desc Get the list of matching users
// @access Public
router.get("/getByUserName/:userName", UserController.getByUserName);

// @route POST /users/current
// @desc Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  UserController.get
);

module.exports = router;
