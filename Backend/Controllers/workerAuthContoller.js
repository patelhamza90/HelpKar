const workerModel = require("../Models/workerModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const workerSignIn = async (req, res) => {

    try {

        const { workerUID, password } = req.body;

        const worker = await workerModel.findOne({ workerUID });

        if (!worker) {
            return res.status(401).json({
                message: "Invalid Worker UID or Password.",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, worker.password);


        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Worker UID or Password.",
                success: false
            })
        }

        const jwtToken = jwt.sign(
            { workerUID: worker.workerUID, id: worker._id, role: "worker" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "SignIn Successfull...",
            success: true,
            workerToken: jwtToken,
            worker: {
                id: worker._id,
                name: worker.fullName,
                email: worker.email
            }
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err
        })
    }
}

const workerSignUp = async (req, res) => {
    try {


console.log(req.body)

        const idProof = req.file;
        if (!req.file) {
            return res.status(400).json({
                message: "ID Proof is required",
                success: false
            });
        }
        const {
            fullName,
            gender,
            email,
            service,
            category,
            city,
            phone,
            address
        } = req.body;

        const emailExist = await workerModel.findOne({ email });

        if (emailExist) {
            return res.status(409).json({
                message: "Email is already exists, please try with another",
                success: false
            })
        }
        const phoneExist = await workerModel.findOne({ phone });

        if (phoneExist) {
            return res.status(409).json({
                message: "Phone is already exists, please try with another",
                success: false
            })
        }

        const WorkerModel = new workerModel({
            fullName,
            gender,
            email,
            service,
            category,
            phone,
            city,
            address,
            idProof: {
                fileName: idProof.originalname,
                fileUrl: idProof.path || idProof.secure_url,
                fileType: idProof.mimetype
            },
        });

        await WorkerModel.save();

        res.status(201).json({
            message: "Worker Registration Successful",
            success: true
        })
    } catch (err) {
console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err
        })
    }
}

const workerForgotPassword = async (req, res) => {

    try {
        const { workerUID, email, password } = req.body;


        const worker = await workerModel.findOne({ workerUID, email });


        if (!worker) {
            return res.status(403).json({
                message: "Invalid UID and Email!",
                success: false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        worker.password = hashedPassword;
        worker.isActive = true;

        await worker.save();

        res.status(201).json({
            message: "Password saved successful",
            success: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err
        })
    }
}
const verifyWorkerForPasswordReset = async (req, res) => {
    try {
        const { workerUID, email } = req.body;

        const userExist = await workerModel.findOne({ workerUID, email });

        if (!userExist) {
            return res.status(403).json({
                message: "Invalid UID and Email!",
                success: false,
            })
        }

        res.status(201).json({
            message: "Worker identity verified successfully",
            success: true
        })
    } catch (err) {

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err
        })
    }
}

module.exports = { workerSignUp, workerSignIn, workerForgotPassword, verifyWorkerForPasswordReset }