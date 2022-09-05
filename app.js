const express = require("express");
var createError = require('http-errors');
const path = require("path");
const blogRouter = require("./routes/blog")
const commentRouter = require("./routes/comment")
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/blog', blogRouter)
app.use('/comment', commentRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log("caught 404")
    next(createError(404));
});
  
// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500).send({message:err.message});;
// });

module.exports = app;



