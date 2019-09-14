// Load Job model
const Job = require("../models/Job");

// Load  Profile model
const Profile = require("../models/Profile");

// Load Job Validation
const validateJobInput = require("../validation/job");

const getAll = (req, res) => {
  Job.find()
    .sort({ date: -1 })
    .then(jobs => res.json(jobs))
    .catch(err =>
      res.status(404).json({ errors: { jobsnotfound: "JOBS_NOT_FOUND" } })
    );
};

module.exports.getAll = getAll;

const getById = (req, res) => {
  Job.findById(req.params.id)
    .then(job => {
      if (job) {
        return res.json({ job });
      } else {
        return res
          .status(404)
          .json({ errors: { jobnotfound: "JOB_NOT_FOUND" } });
      }
    })
    .catch(err =>
      res.status(404).json({ errors: { jobnotfound: "JOB_NOT_FOUND" } })
    );
};

module.exports.getById = getById;

const create = (req, res) => {
  const { errors, isValid } = validateJobInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // Find User's Profile to assign job to the profile
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const jobInfo = {};

      jobInfo.employer = profile.id;
      jobInfo.title = req.body.title;
      jobInfo.location = req.body.location;
      jobInfo.date = req.body.date;
      jobInfo.pricePerHour = req.body.pricePerHour;
      jobInfo.priceOverall = req.body.priceOverall;
      jobInfo.requirements = req.body.requirements;
      jobInfo.description = req.body.description;
      jobInfo.status = req.body.status;
      jobInfo.worker = req.body.worker;

      const job = new Job(jobInfo);

      job
        .save()
        .then(job => res.json(job))
        .catch(errors => res.status(400).json({ errors }));
    })
    .catch(errors =>
      res
        .status(404)
        .json({ errors: { noprofile: "PROFILE_NOT_FOUND_FOR_THIS_USER" } })
    );
};

module.exports.create = create;

const deleteById = (req, res) => {
  Profile.findOne({ user: req.user.id }) // Search for User's Profile
    .then(profile => {
      Job.findById(req.params.id) // Search for requested job
        .then(job => {
          // Check if User is an author of this job
          if (job.employer.toString() === profile.id) {
            job.remove();
            res.json({ success: true });
          } else {
            return res.status(401).json({
              errors: { noprofilecreated: "JOB_NOT_CREATED_BY_THIS_USER" }
            });
          }
        })
        .catch(errors =>
          res.json({ errors: { jobnotfound: "JOB_NOT_FOUND", ...errors } })
        );
    })
    .catch(err =>
      res.status(401).json({
        errors: { noprofilecreated: "PROFILE_NOT_CREATED_YET", ...err }
      })
    );
};

module.exports.deleteById = deleteById;
