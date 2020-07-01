
/*!
 * Module dependencies
 */

const mongoose = require("../services/mongoose.service").mongoose;
const Schema = mongoose.Schema;

/**
 * agency schema
 */

const ClientSchema = new Schema(
    {
        clientId: { type: String, unique: true },
        agencyId: { type: String, required: true },
        clientName: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        totalBill: { type: Number, required: true },
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

ClientSchema.virtual("clinetId").get(function () {
    return this._id.toHexString();
});

ClientSchema.set("toJSON", {
    virtuals: true,
});

ClientSchema.findById = function (cb) {
    return this.model("Client").find({ Client: this.AgencyId }, cb);
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
ClientSchema.index({
    agencyId: 1,
    totalBill: -1
});
const Client = mongoose.model("Client", ClientSchema);



exports.findByUserId = (id) => {
    return Agency.findOne({ userId: id });
};

exports.findById = (id) => {
    return Client.findById(id).then((result) => {
        console.log("result", result);
        // result = result
        // delete result._id;
        // delete result._v
        return result;
    });
};

exports.createClients = async (userData) => {
    try {
        return await Client.insertMany(userData)
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

exports.listClietsByIds = async (idArr) => {
    return await Client.find({ clientId: idArr });
}

exports.updateClient = async (clientId, data) => {
    return await Client.updateOne({ clientId: clientId }, { $set: data });
}

exports.findMax = async (agencyId) => {
    return await Client.find({ agencyId: agencyId }).sort({totalBill:-1}).limit(1);
}

