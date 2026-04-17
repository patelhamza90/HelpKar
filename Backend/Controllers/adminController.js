const bookingModel = require("../Models/bookingModel");
const workerModel = require("../Models/workerModel");
const complaintsModel = require("../Models/complaintsModel");
const adminModel = require("../Models/adminModel");

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const sendEmail = require("../utils/sendEmail");

const adminSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await adminModel.findOne({ email, role: "admin" });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid Admin Credentials",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Admin Credentials",
                success: false
            });
        }

        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            success: true,
            message: "Admin Login Successful",
            token,
        });

    } catch (err) {

        res.status(500).json({
            message: err,
            success: false
        });
    }
};

const workerData = async (req, res) => {
    try {

        const totalWorkers = await workerModel.countDocuments({
            applicationStatus: "accepted"
        });

        const topWorkers = await bookingModel.aggregate([
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: "$workerId",
                    jobsCompleted: { $sum: 1 }
                }
            },
            { $sort: { jobsCompleted: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "workers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "worker"
                }
            },
            { $unwind: "$worker" },
            {
                $project: {
                    name: "$worker.fullName",
                    service: "$worker.service",
                    phone: "$worker.phone",
                    jobsCompleted: 1
                }
            }
        ]);

        // TODAY BOOKINGS
        const todayBookings = await bookingModel.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        //  WEEKLY REVENUE (last 7 days)
        const start = new Date();
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);

        const weeklyData = await bookingModel.aggregate([
            {
                $match: {
                    status: "completed",
                    createdAt: { $gte: start } // 🔥 important
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$price" }
                }
            }
        ]);

        //  ALL TIME AVG RATING
        const ratingData = await bookingModel.aggregate([
            {
                $match: {
                    status: "completed",
                    rating: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: null,
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            response: {
                totalWorkers,
                topWorkers,
                todayBookings,
                weeklyRevenue: weeklyData[0]?.totalRevenue || 0,
                avgRating: ratingData[0]?.avgRating || 0
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

const manageWorkers = async (req, res) => {

    try {

        const workerData = await workerModel.aggregate([

            {
                $match: {
                    applicationStatus: "accepted"
                }
            },

            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "workerId",
                    as: "bookingData"
                }
            },
            {
                $addFields: {
                    jobsCompleted: {
                        $size: {
                            $filter: {
                                input: "$bookingData",
                                as: "b",
                                cond: { $eq: ["$$b.status", "completed"] }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    fullName: 1,
                    service: 1,
                    phone: 1,
                    workerUID: 1,
                    applicationStatus: 1,
                    jobsCompleted: 1
                }
            },
            {
                $sort: { jobsCompleted: -1 }
            },
            {
                $limit: 5
            }
        ]);

        if (!workerData) {
            return res.status(404).json({
                message: "NO Worker Found",
                success: false
            })
        }

        res.status(200).json({
            message: "worker found",
            success: true,
            response: workerData
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const removeWorker = async (req, res) => {

    try {

        const { id } = req.params;

        await workerModel.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Worker removed successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

};

const blockWorker = async (req, res) => {

    try {

        const { id } = req.body;

        const worker = await workerModel.findById(id);

        worker.isActive = !worker.isActive;

        await worker.save();

        res.json({ success: true });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const workerApplication = async (req, res) => {
    try {

        const application = await workerModel.find({ applicationStatus: "pending" })


        if (application.length === 0) {
            return res.status(400).json({
                message: "No Application Found",
                success: false
            })
        }

        res.status(200).json({
            message: "Application found",
            success: true,
            response: application
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}

const userFeedback = async (req, res) => {
    try {

        const application = await complaintsModel
            .find()
            .sort({ createdAt: -1 });

        if (application.length === 0) {
            return res.status(400).json({
                message: "No Application Found",
                success: false
            });
        }

        res.status(200).json({
            message: "Application found",
            success: true,
            response: application
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
const updateComplaint = async (req, res) => {
    try {

        const { id, status, message } = req.body;

        const complaint = await complaintsModel.findById(id);

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        // optional: allow update even if resolved
        if (complaint.status === "resolved" && status === "resolved") {
            return res.status(400).json({
                message: "Already resolved"
            });
        }

        if (status) complaint.status = status;
        if (message) complaint.adminResponse = message;

        await complaint.save();

        res.json({
            success: true,
            message: "Complaint updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateWorkerApplication = async (req, res) => {

    try {

        const { id, status, message } = req.body;

        const application = await workerModel.findById(id);

        if (application.status === "accepted") {
            return res.status(400).json({
                message: "Application already accepted"
            });
        }

        application.status = status;
        application.adminResponse = message;

        await application.save();

        res.status(200).json({
            success: true,
            message: "Application updated"
        });

    } catch (error) {

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }
};

const reportData = async (req, res) => {
    const { type } = req.query;
    try {
        let startDate = new Date();
        let endDate = new Date(); // 👈 SAME RANGE

        if (type === "weekly") {
            startDate.setDate(startDate.getDate() - 7);
        }

        if (type === "monthly") {
            startDate.setMonth(startDate.getMonth() - 1);
        }

        if (type === "yearly") {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }

        // 🔥 IMPORTANT
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const bookings = await bookingModel.find({
            bookingDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate("userId", "name")
            .populate("workerId", "fullName service");

        const totalBookings = bookings.length;

        const accepted = bookings.filter(b => b.status === "completed").length;
        const rejected = bookings.filter(b => b.status === "cancelled").length;

        const revenue = bookings
            .filter(b => b.status === "completed")
            .reduce((sum, b) => sum + b.price, 0);

        res.json({
            success: true,
            response: {
                totalBookings,
                accepted,
                rejected,
                revenue,
                data: bookings
            }

        });
        console.log(bookings)

    } catch (error) {
        console.log(error)
        res.status(500).json({

            message: "Internal server error",
            error: error.message
        });

    }

};

const createAdmin = async (req, res) => {
    try {

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            return res.json({ message: "ENV variables missing" });
        }

        const existingAdmin = await adminModel.findOne({ email });

        if (existingAdmin) {
            return res.json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await adminModel.create({
            email,
            password: hashedPassword,
            role: "admin"
        });

        res.json({
            message: "Admin created successfully",
            admin
        });

    } catch (err) {
        res.status(500).json({
            message: "Error creating admin",
            error: err.message
        });
    }
};

const updateWorkerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { applicationStatus } = req.body;

        const worker = await workerModel.findById(id);

        if (!worker) {
            return res.status(404).json({
                success: false,
                message: "Worker not found"
            });
        }

        // 🔥 EMAIL FIRST
        try {
            if (applicationStatus === "accepted") {
                await sendEmail(
                    worker.email,
                    "Your HelpKar Application Has Been Approved",
`Dear ${worker.fullName},

    We are pleased to inform you that your registration request with HelpKar has been successfully approved.

    Your Worker UID: ${worker.workerUID}

    You can now access your account using the following steps:

    1. Go to the login page of HelpKar.
    2. Click on "Forgot Password".
    3. Enter your Worker UID.
    4. Enter the email address you used during registration.
    5. Set your new password.
    6. Use your Worker UID and new password to log in.

    Once logged in, you will be able to access your dashboard and start accepting service requests.

    If you face any issues, feel free to contact our support team.

    Welcome to HelpKar!

    Best regards,  
    HelpKar Team`
                );
            }

            if (applicationStatus === "rejected") {
                await sendEmail(
                    worker.email,
                    "Update on Your HelpKar Application",
`Dear ${worker.fullName},

    Thank you for your interest in joining HelpKar.

    After careful review of your application, we regret to inform you that you do not meet our current requirements.

    We appreciate your effort and encourage you to apply again in the future.

    If you have any questions, you may contact our support team.

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

        // 🔥 UPDATE ONLY IF EMAIL SUCCESS
        const updated = await workerModel.findByIdAndUpdate(
            id,
            { applicationStatus },
            { returnDocument: "after" }
        );

        res.json({
            success: true,
            message: "Status updated successfully",
            response: updated
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    workerData, manageWorkers, workerApplication,
    userFeedback, updateComplaint, updateWorkerApplication,
    blockWorker, removeWorker, reportData, adminSignIn, updateWorkerStatus, createAdmin
}