const express = require("express");
const router = express.Router();
const passport = require("passport");

//Load JobsController
const JobsController = require("../../controllers/JobsController");

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get("/", JobsController.getAll);

// @route   GET api/jobs/:id
// @desc    Get job by id
// @access  Public
router.get("/:id", JobsController.getById);

// @route   POST api/jobs/
// @desc    Create a job
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  JobsController.create
);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  JobsController.deleteById
);

module.exports = router;
