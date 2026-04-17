const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "workers",
        required: true
    },

    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    bookingDate: {
        type: Date,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    review:{
    type:String,
    default:""
},
    status: {
        type: String,
        enum: ["pending", "accepted", "completed", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

const bookingModel = new mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;