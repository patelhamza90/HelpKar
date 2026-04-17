const express = require("express");
const verifyToken = require("../Middlewares/verifyToken");
const { createServices, getWorkerService, updateServices, updateStatusServices } = require("../Controllers/workerServicesController");
const upload = require("../Middlewares/upload");
const router = express.Router();

router.post('/services/create', verifyToken, upload.single("icon"), createServices);

router.put('/services/update', verifyToken, upload.single("icon"), updateServices);

router.put('/services/update-status', verifyToken, updateStatusServices);

router.get('/services/list', verifyToken, getWorkerService);

module.exports = router;