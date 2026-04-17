const express = require("express");
const verifyToken = require("../Middlewares/verifyToken");
const complaintValidation = require("../Middlewares/complaintValidation");
const upload = require("../Middlewares/upload");
const { createComplaintByUser, getUserProfile, updateUserProfile } = require("../Controllers/userController");
const router = express.Router();

router.post("/complaint/submit", verifyToken, complaintValidation, createComplaintByUser);
router.get("/user-profile", verifyToken, getUserProfile);
router.put("/user-profile/update", verifyToken, upload.single('profileImage'), updateUserProfile);

module.exports = router;