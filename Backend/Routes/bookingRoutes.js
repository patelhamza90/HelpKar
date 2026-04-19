const express = require("express");
const verifyToken = require("../Middlewares/verifyToken");
const { getUserProfile } = require("../Controllers/userController");
const router = express.Router();

const {
    createBooking, listService, serviceForUser,
    getDataForWorker, getBookingRequest, changeAction,
    userStats, addReview, getWorkerHistory,
    cancelBookingByUser
} = require("../Controllers/bookingController");


router.post("/create", verifyToken, createBooking);

router.get("/service-for-user", verifyToken, serviceForUser);
router.get("/list-service/:id", verifyToken, listService);
router.get("/list/user-data", verifyToken, getUserProfile);
router.get("/list/worker-data", verifyToken, getDataForWorker);
router.get("/list/worker-history", verifyToken, getWorkerHistory);
router.get("/list/booking-request", verifyToken, getBookingRequest);

router.get("/user-stats", verifyToken, userStats);
router.put("/cancel-booking", verifyToken, cancelBookingByUser);

router.put("/change/action", verifyToken, changeAction);
router.put("/add-review", verifyToken, addReview)


module.exports = router;