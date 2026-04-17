const workerModel = require("../Models/workerModel");

const fetchWorkerProfile = async (req, res) => {

    const worker = await workerModel.findById(req.user.id);

    if (!worker) {
        return res.status(404).json({
            message: "Worker not found",
            success: false
        })
    }

    res.status(200).json({
        message: "Welcome",
        worker
    })
}

const workerProfileUpdate = async (req, res) => {
    try {

        const workerId = req.user.id;

        const workerExist = await workerModel.findById(workerId);

        if (!workerExist) {
            return res.status(404).json({
                message: "Worker Not Found",
                success: false
            })
        }
        const { fullName, email, phone, gender, address, isActive } = req.body;

        const updateData = {};

        if (fullName !== undefined && fullName.trim() !== "")
            updateData.fullName = fullName.trim();

        if (email !== undefined && email.trim() !== "")
            updateData.email = email.trim();

        if (phone !== undefined && phone.trim() !== "")
            updateData.phone = phone.trim();

        if (gender !== undefined && gender.trim() !== "")
            updateData.gender = gender.trim();

        if (address !== undefined && address.trim() !== "")
            updateData.address = address.trim();

        if (isActive !== undefined)
            updateData.isActive = isActive; // boolean

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update",
                success: false
            });
        }

        const updateWorker = await workerModel.findByIdAndUpdate(
            workerId,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            message: "profile Updated Successfully",
            success: true,
            worker: updateWorker
        })

    } catch (err) {
        
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}
module.exports = { fetchWorkerProfile, workerProfileUpdate }