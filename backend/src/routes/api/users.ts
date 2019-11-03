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

// @route GET /users/sendFriendshipRequest
// @desc sends friendship request to another user
// @access Private
router.get(
  "/sendFriendshipRequest/:toUser",
  passport.authenticate("jwt", { session: false }),
  UserController.sendFriendshipRequest
);

// @route GET /users/acceptFriendshipRequest
// @desc accpets friendship request to another user
// @access Private
router.get(
  "/acceptFriendshipRequest/:fromUser",
  passport.authenticate("jwt", { session: false }),
  UserController.acceptFriendshipRequest
);

// @route GET /users/refuseFriendshipRequest
// @desc refuse friendship request to another user
// @access Private
router.get(
  "/refuseFriendshipRequest/:fromUser",
  passport.authenticate("jwt", { session: false }),
  UserController.refuseFriendshipRequest
);

// @route GET /users/refuseFriendshipRequest
// @desc refuse friendship request to another user
// @access Private
router.get(
  "/clearAllNotifications",
  passport.authenticate("jwt", { session: false }),
  UserController.clearAllNotifications
);

module.exports = router;
