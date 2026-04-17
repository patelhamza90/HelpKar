const mongoose = require("mongoose");
const workerSchema = new mongoose.Schema({
    workerUID: {
        type: String,
        default: () => "WRK" + Math.floor(100000 + Math.random() * 900000),
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    idProof: {
        fileName: {
            type: String
        },
        fileUrl: {
            type: String
        },
        fileType: {
            type: String
        }
    },
    password: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'worker'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    },
    category: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    profilePhoto: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
    applicationStatus: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const workerModel = new mongoose.model('workers', workerSchema);

module.exports = workerModel;