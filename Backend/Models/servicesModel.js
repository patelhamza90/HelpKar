const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({

    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workers',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    radiusKM: {
        type: Number,
        required: true,
        min: 1
    },
    icon: {
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
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
}, { timestamps: true })

const servicesModel = new mongoose.model("services", servicesSchema);
module.exports = servicesModel;
