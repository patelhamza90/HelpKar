const complaintsModel = require("../Models/complaintsModel");
const UserModel = require("../Models/userModel");

const createComplaintByUser = async (req, res) => {

    try {

        const userId = req.user._id;
        const { complaint } = req.body;

        const complaintData = new complaintsModel({
            userId,
            complaint
        })
        await complaintData.save();

        res.status(201).json({
            message: "Compaint has been Submitted",
            success: true
        })

    } catch (error) {

        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        })
    }


};


const getUserProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const result = await UserModel.findOne({ _id: userId });

        if (!result) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        res.status(200).json({
            message: "User Found",
            success: true,
            response: result
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            error: error.message
        })
    }
}

const updateUserProfile = async (req, res) => {
    try {

        const userId = req.user._id;

        const userExist = await UserModel.findOne({ _id: userId });

        if (!userExist) {
            return res.status(404).json({
                message: "User not Found",
                success: false
            })

        }

        const { name, address, phone, email, gender } = req.body;
        const profileImage = req.file;

        const updateData = {};

        if (name !== undefined && name.trim() !== "")
            updateData.name = name.trim();

        if (address !== undefined && address.trim() !== "")
            updateData.address = address.trim();

        if (gender !== undefined && gender.trim() !== "")
            updateData.gender = gender.trim();

        if (email !== undefined && email.trim() !== "")
            updateData.email = email.trim();

        if (phone !== undefined && phone.trim() !== "")
            updateData.phone = phone.trim();

        if (profileImage) {
            updateData.profileImage = {
                fileName: profileImage.originalname,
                fileUrl: profileImage.path || profileImage.secure_url,
                fileType: profileImage.mimetype
            };
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update",
                success: false
            });
        }

        const result = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        res.status(200).json({
            message: "Profile Updated Successfully",
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

module.exports = { createComplaintByUser, getUserProfile, updateUserProfile }