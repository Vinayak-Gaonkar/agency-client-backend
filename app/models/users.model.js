/*!
 * Module dependencies
 */

const mongoose = require("../services/mongoose.service").mongoose;
const Schema = mongoose.Schema;

const genders = new Set(["Male", "Female", "Others"]);
/**
 * User schema
 */

const UserSchema = new Schema(
  {
    userId: { type: String },
    displayName: { type: String },
    firstname: { type: String, lowercase: true },
    lastname: { type: String, lowercase: true },
    email: { type: String, lowercase: true, unique: true },
    password: { type: String },
    gender: { type: String },
    dob: { type: Date },
    image: { type: String },
    profile: { type: Object },
    permissionLevel: { type: Number },
    provider: { type: String },
  },
  {
    timestamps: true,
  }
);

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.virtual("id").get(function() {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.findById = function(cb) {
  return this.model("Users").find({ id: this.id }, cb);
};

/**
 * Methods
 */

/**
 * Statics
 */

/**
 * Register
 */

const User = mongoose.model("Users", UserSchema);

exports.findByEmail = (email) => {
  return User.findOne({ email: email });
};

exports.findByUserId = (id) => {
  return User.findOne({ userId: id });
};

exports.findById = (id) => {
  return User.findById(id).then((result) => {
    console.log("result", result);
    // result = result
    // delete result._id;
    // delete result._v
    return result;
  });
};

exports.createUser = (userData) => {
  return new Promise((resolve, reject) => {
    const user = new User(userData);
    return user.save(function(err, userData) {
      if (err) return reject(err);
      resolve(userData);
    });
  });
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    User.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function(err, users) {
        if (err) {
          reject(err);
        } else {
          resolve(users);
        }
      });
  });
};

exports.patchUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    User.findById(id, function(err, updateUser) {
      if (err) reject(err);
      for (let i in userData) {
        user[i] = userData[i];
      }
      user.save(function(err, updatedUser) {
        if (err) return reject(err);
        resolve(updatedUser);
      });
    });
  });
};

exports.removeByID = (userId) => {
  return new Promise((resolve, reject) => {
    User.remove({ _id: userId }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
};
