/*!
 * Module dependencies
 */

const mongoose = require("../services/mongoose.service").mongoose;
const Schema = mongoose.Schema;

/**
 * agency schema
 */

const AgencySchema = new Schema(
  {
    agencyId: { type: String, required: true },
    agencyName: { type: String },
    address1: { type: String, required: true },
    address2: { type: String },
    state: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    maxTotalBill: { type: Number, default: 0 }
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

AgencySchema.virtual("AgencyId").get(function () {
  return this._id.toHexString();
});

AgencySchema.set("toJSON", {
  virtuals: true,
});

AgencySchema.findById = function (cb) {
  return this.model("Agency").find({ AgencyId: this.AgencyId }, cb);
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

const Agency = mongoose.model("Agency", AgencySchema);



exports.findAgencyId = async (id) => {
  return await Agency.find({ agencyId: id });
};

exports.findById = (id) => {
  return Agency.findById(id).then((result) => {
    console.log("result", result);
    // result = result
    // delete result._id;
    // delete result._v
    return result;
  });
};

exports.createAgency = async (userData) => {
  try {
    const agencydata = new Agency(userData);
    return await agencydata.save()
  } catch (error) {
    throw Error(error)
  }
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Agency.find()
      .limit(perPage)
      .skip(perPage * page)
      .exec(function (err, users) {
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
    Agency.findById(id, function (err, updateUser) {
      if (err) reject(err);
      for (let i in userData) {
        user[i] = userData[i];
      }
      user.save(function (err, updatedUser) {
        if (err) return reject(err);
        resolve(updatedUser);
      });
    });
  });
};

exports.groupByAgency = async () => {

  let lookup = {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "agencyId",
      as: "details"
    }
  }
  let unwind = {
    $unwind: { path: "$details" }
  };
  let group = {
    "$group": {
      "_id": "$_id",
      "maxScore": {
        "$max": "$details.totalBill"
      },
      agencyname: { $first: '$agencyName' },
      "clientgrp": {
        "$push": {
          "agency": "$agencyName",
          "clientName": "$details.clientName",
          "score": "$details.totalBill"
        }
      }
    }
  }
  return await Agency.aggregate([lookup, unwind, group])
}

exports.getAllAgency = async () => {
  let lookup = {
    $lookup: {
      from: "clients",
      localField: "_id",
      foreignField: "agencyId",
      as: "details"
    }
  }

  let project = {
    $project:
    {
      agencyName: 1,
      pets:
      {
        $filter:
        {
          input: "$details",
          as: "detail",
          cond: { $gte: ["$$detail.totalBill", "$maxTotalBill"] }
        }
      }
    }
  }
  return await Agency.aggregate([lookup, project])
}

exports.updateMaxBill = async (id, score) => {
  return await Agency.updateOne({ AgencyId: id }, { $set: { maxTotalBill: score } })
}

