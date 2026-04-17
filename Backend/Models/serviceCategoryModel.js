const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },

    services: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

const serviceCategoryModel = new mongoose.model("serviceCategories", serviceCategorySchema);

module.exports = serviceCategoryModel;
