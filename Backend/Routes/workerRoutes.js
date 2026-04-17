const express = require("express");
const verifyToken = require("../Middlewares/verifyToken");
const { fetchWorkerProfile, workerProfileUpdate } = require("../Controllers/workerController");
const router = express.Router();


router.get("/worker-dashboard", verifyToken, fetchWorkerProfile);
router.put("/worker-profile-update", verifyToken, workerProfileUpdate);


module.exports = router;