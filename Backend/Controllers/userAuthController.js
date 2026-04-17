const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const workerModel = require("../Models/workerModel");

const userSignUp = async (req, res) => {
    try {
        const { name, email, phone, password, gender } = req.body;

        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.json({
                message: "Email is Already Exist, try with Different Email"
            })
        }
        const user = new UserModel({ name, email, phone, password, gender });

        user.password = await bcrypt.hash(password, 10);

        await user.save();

        res.status(201).json({
            message: "Registration Successful",
            success: true
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err
        })
    }
}

const userSignIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Invalid Email and Password.",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Email and Password.",
                success: false
            })
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "SignIn Successfull...",
            success: true,
            userToken: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
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
module.exports = { userSignUp, userSignIn, }