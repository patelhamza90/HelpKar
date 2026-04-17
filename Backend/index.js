const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
require('./config/Db');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/authRoutes');
const workerRoutes = require('./Routes/workerRoutes');
const workerServicesRoutes = require('./Routes/workerServicesRoutes');
const servicesRoutes = require('./Routes/servicesRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const userRoutes = require('./Routes/userRoutes');
const adminRoutes = require('./Routes/adminRoutes');

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.status(200).send("HelpKar Backend Running 🚀");
});

/* ============= Auth Routing================ */
app.use("/api/auth", authRoutes);

/* ============= Worker Routing================ */
app.use("/api/worker", workerRoutes);

app.use("/api/worker", workerServicesRoutes);

/* ============= User Routing================ */
app.use("/api/user", userRoutes);

/* ============= Services Routing================ */
app.use("/api/services", servicesRoutes);

/* ============= Booking Routing================ */
app.use("/api/booking", bookingRoutes);

/* ============= Admin Routing================ */
app.use("/api/admin", adminRoutes);

/* app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: err.message });
}); */

app.listen(PORT, () => {
  console.log(`PORT is Running on : ${PORT}`)
})