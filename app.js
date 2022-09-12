const dotenv = require('dotenv');
dotenv.config();

const createServer = require('./utils/server')

const mongoDB = process.env.MONGODB_URI;


const app = createServer(mongoDB);

module.exports = app;



