const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['user', 'worker', 'admin'],
        default: 'user'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    profileImage: {
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
    address: {
        type: String,
        default: null
    }
}, { timestamps: true });

const UserModel = new mongoose.model('users', userSchema)
module.exports = UserModel