export {};
const express = require("express");
const router = express.Router();
const passport = require("passport");

const PhotosController = require("../../controllers/PhotoController");

// @route POST /photos
// @desc Create new photo
// @access Private
router.post(
  "/photos",
  passport.authenticate("jwt", { session: false }),
  PhotosController.create
);

// @route GET /photos
// @desc Get photos list
// @access Public
router.get("/photos", PhotosController.get);

module.exports = router;
