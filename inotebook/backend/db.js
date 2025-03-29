const mongoose = require('mongoose');

const mongoURI = "mongodb://127.0.0.1:27017/inotebook";

const connectToMongo = async  () => {

    await mongoose.connect(mongoURI); // No need for deprecated options
        console.log("✅ Connected to MongoDB successfully!");
        
    }


module.exports = connectToMongo;
