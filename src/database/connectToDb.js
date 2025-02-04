const mongoose = require('mongoose');
const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log("Error connecting to MongoDB");
        process.exit(1);
    }
}

module.exports = {connectToDb};