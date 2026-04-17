const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true
    },

    password: String,

    role: {
        type: String,
        default: "admin"
    }

}, { timestamps: true });

const adminModel = new mongoose.model("Admin", adminSchema);

module.exports = adminModel;