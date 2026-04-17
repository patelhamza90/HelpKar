const express = require("express");
const { listServicesForUser, getHighestPrice,listWorkerData, listCategories, getHomeStats, getPopularServices } = require("../Controllers/servicesController");
const router = express.Router();


router.get('/list', listServicesForUser);
router.get('/list/workerData', listWorkerData);
router.get('/list/highestPrice', getHighestPrice);
router.get('/list/category',listCategories );

router.get('/home-stats',getHomeStats )
router.get('/popular',getPopularServices )

module.exports = router;