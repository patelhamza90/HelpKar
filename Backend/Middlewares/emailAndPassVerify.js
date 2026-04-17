const workerModel = require("../Models/workerModel");

const emailAndPassVerify = async (req, res, next) => {

    try {

        const { workerUID, email } = req.body;

        const userExist = await workerModel.findOne({ workerUID, email });

        if (!userExist) {
            return res.status(403).json({
                message: "Invalid UID and Email!",
                success: false,
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error.",
            success: false,
            error: err
        })
    }

    next();
}

module.exports = emailAndPassVerify;