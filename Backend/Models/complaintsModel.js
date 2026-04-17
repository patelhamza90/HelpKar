const mongoose = require("mongoose");

const complaintsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    complaint: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ["pending","reject", "resolved"],
        default: "pending"
    }
}, { timestamps: true })

const complaintsModel = new mongoose.model("complaints", complaintsSchema);

module.exports = complaintsModel