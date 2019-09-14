// Load Profile model
const Profile = require("../models/Profile");

// Load User model
const User = require("../models/User");

// Load Profile Validation
const validateProfileInput = require("../validation/profile");

const getCurrent = (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      const errors = {};

      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        return res.status(400).json({ errors });
      }
      res.json(profile);
    })
    .catch(errors => res.json(errors));
};

module.exports.getCurrent = getCurrent;

const getAll = (req, res) => {
  const errors = {};
  Profile.find()
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json({ errors });
      }

      res.json(profiles);
    })
    .catch(err =>
      res.status(400).json({ errors: { noprofile: "There are no profiles." } })
    );
};

module.exports.getAll = getAll;

const getById = (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for user with this ID";
        return res.status(404).json({ errors });
      }
    })
    .catch(err =>
      res.status(404).json({
        errors: { profile: "There is no profile for user with this ID" }
      })
    );
};

module.exports.getById = getById;

const createOrUpdate = (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  // isPhoneConfirmed will get its own route
  // isPremium will get its own route

  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if (req.body.name)
    profileFields.name = req.body.name
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (req.body.surname)
    profileFields.surname = req.body.surname
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (req.body.avatar) profileFields.avatar = req.body.avatar;
  if (req.body.creditCardNumber)
    profileFields.creditCardNumber = req.body.creditCardNumber;
  if (req.body.city)
    profileFields.city = req.body.city
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (req.body.zipCode) profileFields.zipCode = req.body.zipCode;
  if (req.body.country)
    profileFields.country = req.body.country
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  if (req.body.phoneNumber) profileFields.phoneNumber = req.body.phoneNumber;
  if (req.body.isPhoneConfirmed)
    profileFields.isPhoneConfirmed = req.body.isPhoneConfirmed;
  if (req.body.isPremium) profileFields.isPremium = req.body.isPremium;
  if (req.body.description)
    profileFields.description = req.body.description
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  Profile.findOne({ user: req.user.id }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.json(profile));
    } else {
      // Create
      new Profile(profileFields).save().then(profile => res.json(profile));
    }
  });
};

module.exports.createOrUpdate = createOrUpdate;

const deleteProfileAndUser = (req, res) => {
  Profile.findOneAndRemove({ user: req.user.id }).then(() => {
    User.findOneAndRemove({ _id: req.user.id }).then(() =>
      res.json({ success: true })
    );
  });
};

module.exports.deleteProfileAndUser = deleteProfileAndUser;
