const mongoose = require('mongoose');

const connectDb = async(uri) => {
    await mongoose.connect(uri, { useNewUrlParser: true , useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}
module.exports = connectDb;


