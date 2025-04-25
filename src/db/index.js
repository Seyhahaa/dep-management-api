const mongoose = require('mongoose');

const dbName = process.env.DB_NAME
const containerMongo = 'mongodb'
// Test editing
// MongoDB connection URI
const mongoURI = 'mongodb+srv://Seyha:c97nZwfMRpJg5mZE@cluster0.byk08bk.mongodb.net/';

async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log("Connected: ", dbName)
    })
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
        dbName: dbName
    })
}

module.exports = dbConnect