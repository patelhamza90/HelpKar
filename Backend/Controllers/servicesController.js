const serviceCategoryModel = require("../Models/serviceCategoryModel");
const servicesModel = require("../Models/servicesModel");
const workerModel = require("../Models/workerModel");
const bookingModel = require("../Models/bookingModel");
const mongoose = require("mongoose");

const listServicesForUser = async (req, res) => {
    try {

        const result = await servicesModel.find();

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Services not Found",
                success: false
            })
        }
        res.status(200).json({
            success: true,
            response: result
        })


    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error
        })
    }
}

const getHighestPrice = async (req, res) => {
    try {

        const result = await servicesModel.aggregate([
            {
                $group: {
                    _id: null,
                    highestPrice: {
                        $max: "$price"
                    }
                }
            }
        ])

        if (!result) {
            return res.status(404).json({
                message: "Total Price not Available",
                success: true
            })
        }

        res.status(200).json({
            response: result,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}
const listWorkerData = async (req, res) => {
    try {

        const result = await workerModel.find().select("fullName email address phone service city category experience");

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Not worker Found",
                success: false
            })
        }
        res.status(200).json({
            response: result,
            count: result.length,
            success: true
        })


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}
const listCategories = async (req, res) => {
    try {

        const result = await serviceCategoryModel.find();

        res.status(200).json({
            success: true,
            response: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getHomeStats = async (req, res) => {

    const services = await servicesModel.aggregate([
        {
            $group: {
                _id: "$title",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ])

    const rating = await bookingModel.aggregate([
        {
            $match: {
                rating: { $gt: 0 },
                status: "completed"
            }
        },
        {
            $group: {
                _id: null,
                avgRating: { $avg: "$rating" }
            }
        }
    ]);

    res.json({
        success: true,
        response: {
            services,
            avgRating: rating[0]?.avgRating || 0
        }
    })

}

const updateServiceRating = async (serviceId) => {

    const result = await bookingModel.aggregate([
        {
            $match: {
                serviceId: new mongoose.Types.ObjectId(serviceId),
                rating: { $gt: 0 }
            }
        },
        {
            $group: {
                _id: "$serviceId",
                avgRating: { $avg: "$rating" },
                total: { $sum: 1 }
            }
        }
    ]);

    const avgRating = result[0]?.avgRating || 0;
    const totalRatings = result[0]?.total || 0;

    await servicesModel.findByIdAndUpdate(serviceId, {
        rating: avgRating,
        totalRatings: totalRatings
    });
};

const getPopularServices = async (req, res) => {
    const popular = await servicesModel
        .find()
        .sort({ rating: -1 })
        .limit(3)
}

module.exports = {
    listServicesForUser, getHighestPrice, listWorkerData,
    listCategories, getHomeStats, getPopularServices,
    updateServiceRating
};