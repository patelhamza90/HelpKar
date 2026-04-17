const mongoose = require("mongoose");
const bookingModel = require("../Models/bookingModel");
const servicesModel = require("../Models/servicesModel");
const UserModel = require("../Models/userModel");
const { updateServiceRating } = require("./servicesController");

const sendEmail = require("../utils/sendEmail");


const createBooking = async (req, res) => {

    try {

        const userId = req.user._id;

        const {
            serviceId,
            workerId,
            price,
            address,
            bookingDate,
            bookingTime
        } = req.body;

        // validation
        if (!serviceId || !workerId || !price || !address || !bookingDate || !bookingTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const booking = new bookingModel({
            userId,
            serviceId,
            workerId,
            price,
            address,
            bookingDate: new Date(bookingDate),
            bookingTime
        });

        const result = await booking.save();

        return res.status(201).json({
            success: true,
            message: "Booking confirmed 🎉\nYour service has been scheduled successfully.",
            response: result
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server Error",
            error: error.message
        });

    }
};

const listService = async (req, res) => {
    try {
        const workerId = req.params.id;

        const result = await servicesModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(workerId)
                }
            },
            {
                $lookup: {
                    from: 'workers',
                    localField: 'workerId',
                    foreignField: "_id",
                    as: 'workerDetails'
                }
            },
            {
                $unwind: '$workerDetails'
            },
            {
                $project: {
                    _id: 0,
                    workerId: "$workerDetails._id",
                    workerName: "$workerDetails.fullName",
                    service: "$workerDetails.service",
                    address: "$workerDetails.address",
                    category: "$workerDetails.category",
                    experience: "$workerDetails.experience",
                    price: "$price",
                    rating: "$rating"
                }
            }
        ])

        return res.status(200).json({
            success: true,
            response: result
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const serviceForUser = async (req, res) => {
    try {

        const userId = req.user._id;

        const userExist = await UserModel.findById(userId);
        console.log(userId)

        if (!userExist) {
            return res.status(404).json({
                message: "User not Found",
                success: false
            })
        }
        const bookings = await bookingModel
            .find({ userId })
            .populate("serviceId", "title price icon")
            .populate("workerId", "fullName service")
            .sort({ createdAt: -1 });

        if (bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No bookings found",
                response: []
            })
        }

        res.status(200).json({
            message: "Booking Fetched successfully",
            success: true,
            response: bookings
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server Error",
            error: error.message
        })
    }
}

const getDataForWorker = async (req, res) => {
    try {

        const workerId = req.user.id;

        const stats = await bookingModel.aggregate([
            {
                $match: {
                    workerId: new mongoose.Types.ObjectId(workerId)
                }
            },
            {
                $group: {
                    _id: null,

                    totalEarning: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                "$price",
                                0
                            ]
                        }
                    },

                    overallRating: {
                        $avg: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "completed"] },
                                        { $gt: ["$rating", 0] }
                                    ]
                                },
                                "$rating",
                                null
                            ]
                        }
                    },

                    taskComplete: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "completed"] },
                                1,
                                0
                            ]
                        }
                    },

                    taskPending: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "pending"] },
                                1,
                                0
                            ]
                        }
                    }

                }
            }
        ]);

        const totalEarning = stats.length ? stats[0].totalEarning : 0;
        const overallRating = stats.length ? stats[0].overallRating : 0;
        const taskComplete = stats.length ? stats[0].taskComplete : 0;
        const taskPending = stats.length ? stats[0].taskPending : 0;

        res.status(200).json({
            success: true,
            response: {
                totalEarning,
                overallRating,
                taskComplete,
                taskPending
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const getBookingRequest = async (req, res) => {
    try {

        const workerId = req.user.id;
        const status = req.query.status;

        let query = { workerId };

        if (status) {
            query.status = status;
        }

        const result = await bookingModel
            .find(query)
            .populate("userId", "name email")
            .populate("workerId", "service")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            response: result
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const changeAction = async (req, res) => {
    try {

        const { bookingId, action } = req.body;

        const booking = await bookingModel
            .findById(bookingId)
            .populate("userId", "name email")
            .populate("workerId", "fullName service phone")

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found.",
                success: false
            });
        }

        // 🔥 EMAIL FIRST
        try {

            if (action === "accepted") {
                await sendEmail(
                    booking.userId.email,
"Your Booking Has Been Accepted",
`Dear ${booking.userId.name},

We are pleased to inform you that your service request has been accepted by the assigned worker.

Service Details:

• Service: ${booking.workerId.service}
• Worker: ${booking.workerId.fullName}
• Contact Number: ${booking.workerId.phone}
• Date: ${booking.bookingDate.toISOString().slice(0, 10)}
• Time: ${booking.bookingTime}

The worker will arrive at your location as per the scheduled time.

Thank you for choosing HelpKar.

Best regards,  
HelpKar Team`
                );
            }

            if (action === "cancelled") {
                await sendEmail(
                    booking.userId.email,
"Update on Your Booking Request",
`Dear ${booking.userId.name},

We regret to inform you that your service request has been declined by the assigned worker.

You may try booking another worker at your convenience.

We apologize for the inconvenience caused.

Thank you for your understanding.

Best regards,  
HelpKar Team`
                );
            }

        } catch (emailError) {
            return res.status(500).json({
                success: false,
                message: "Problem to send email"
            });
        }

        // 🔥 UPDATE AFTER EMAIL SUCCESS
        const result = await bookingModel.findByIdAndUpdate(
            bookingId,
            { $set: { status: action } },
            { returnDocument: "after" }
        );

        res.status(200).json({
            message: `Booking ${action} successfully.`,
            success: true,
            response: result
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const userStats = async (req, res) => {

    try {

        const userId = req.user._id;

        const completedBookings = await bookingModel.find({
            userId,
            status: "completed"
        }).populate("serviceId");

        const totalSpent = completedBookings.reduce((sum, b) => {
            return sum + (b.serviceId?.price || 0);
        }, 0);

        res.json({
            success: true,
            response: {
                totalSpent,
                totalBookings: completedBookings.length
            }
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }

};

const addReview = async (req, res) => {

    try {

        const { bookingId, rating, review } = req.body;

        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found"
            })
        }
        booking.rating = Number(rating);
        booking.review = review;

        await booking.save();

        await updateServiceRating(booking.serviceId);

        res.json({
            success: true,
            message: "Review submitted successfully"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }

}

const getWorkerHistory = async (req, res) => {
    try {

        const workerId = req.user.id;

        const result = await bookingModel
            .find({ workerId })
            .populate("userId", "name")
            .populate("serviceId", "title")
            .sort({ createdAt: -1 });

        if (!result.length) {
            return res.status(200).json({
                success: true,
                message: "No service history found",
                response: []
            });
        }

        res.status(200).json({
            success: true,
            message: "Worker history fetched successfully",
            response: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });

    }
};


module.exports = {
    createBooking, listService, serviceForUser,
    getDataForWorker, getBookingRequest, changeAction,
    userStats, addReview, getWorkerHistory
};