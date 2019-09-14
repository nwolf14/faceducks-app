const express = require("express");
const router = express.Router();
const passport = require("passport");

const ProfileController = require("../../controllers/ProfileController");

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.getCurrent
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", ProfileController.getAll);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", ProfileController.getById);

// @route POST api/profile
// @desc Create or update user profile
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.createOrUpdate
);

// @route   DELETE api/profile
// @desc    Delete User and Profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProfileController.deleteProfileAndUser
);

module.exports = router;
