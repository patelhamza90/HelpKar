const jwt = require("jsonwebtoken");
const servicesModel = require("../Models/servicesModel");

const createServices = async (req, res) => {

    try {

        const { title, description, price, radiusKM } = req.body;

        const workerId = req.user.id;

        const icon = req.file;

        if (!icon) {
            return res.status(400).json({
                message: "Upload Service Image",
                success: false
            })
        }

        const existService = await servicesModel.findOne({ workerId })

        if (existService) {
            return res.status(409).json({
                message: "You have already created this Service",
                success: false
            })
        }

        const service = new servicesModel({
            workerId,
            title,
            description,
            price,
            radiusKM,
            icon: {
                fileName: icon.originalname,
                fileUrl: icon.path || icon.secure_url,
                fileType: icon.mimetype
            },
        })
        await service.save();

        res.status(201).json({
            message: "Service has been created",
            success: true,
            service
        })


    } catch (err) {

        if (err.code === 11000) {
            return res.status(400).json({
                message: "Service already exists for this category",
                success: false
            });
        }
        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}


const getWorkerService = async (req, res) => {

    try {
        const workerId = req.user.id;

        const result = await servicesModel.findOne({ workerId })

        return res.status(200).json({
            success: true,
            response: result
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const updateServices = async (req, res) => {

    try {

        const workerId = req.user.id;
        const { title, description, price, radiusKM } = req.body;
        const icon = req.file;

        const existService = await servicesModel.findOne({ workerId });

        if (!existService) {
            return res.status(404).json({
                message: "Service not Found",
                success: false
            })
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (radiusKM !== undefined) updateData.radiusKM = radiusKM;

        if (icon) {
            updateData.icon = {
                fileName: icon.originalname,
                fileUrl: icon.path || icon.secure_url,
                fileType: icon.mimetype
            };
        }

        const result = await servicesModel.findOneAndUpdate(
            { workerId },
            { $set: updateData },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            message: "Sevice updated Successfully",
            success: true,
            response: result
        })

    } catch (error) {

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const updateStatusServices = async (req, res) => {
    try {

        const workerId = req.user.id;
        const { isAvailable } = req.body;

        const existService = await servicesModel.findOne({ workerId });

        if (!existService) {
            return res.status(404).json({
                message: "Service not found",
                success: false
            });
        }
        const result = await servicesModel.findOneAndUpdate(
            { workerId },
            { $set: { isAvailable } },
            { new: true, runValidators: true }
        );


        return res.status(200).json({
            message: "Status has been changed",
            success: true,
            response: result
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server Error",
            error: error.message
        })
    }
}

module.exports = { createServices, getWorkerService, updateServices, updateStatusServices }