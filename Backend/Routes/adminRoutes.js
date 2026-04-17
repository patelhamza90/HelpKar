const express = require("express");
const router = express.Router();
const {
    workerData, manageWorkers, workerApplication,
    userFeedback, updateComplaint, updateWorkerApplication,
    blockWorker, removeWorker, reportData,
    adminSignIn,updateWorkerStatus,
    createAdmin
} = require("../Controllers/adminController");


router.post("/signin", adminSignIn);

router.get('/list/worker-data', workerData);

router.get("/list/manage-worker", manageWorkers);
router.put("/block-worker", blockWorker);
router.delete("/remove-worker/:id", removeWorker);
router.get('/list/worker-application', workerApplication);


router.get('/list/user-feedback', userFeedback);

router.put('/update/complaint', updateComplaint);
router.put("/update/worker-application", updateWorkerApplication);
router.put("/update-status/:id", updateWorkerStatus);

router.get("/reports", reportData);

//router.get("/create-admin", createAdmin); 

module.exports = router;