const mongoose = require('mongoose');
const Mongo_URL = process.env.MONGO_URL;

mongoose.connect(Mongo_URL).then(() => {
    console.log("MongoDb Connected!...")
}).catch((er) => {
    console.log("MongoDB Error -> ", er)
}) 