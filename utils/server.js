const express = require("express");
var createError = require('http-errors');
const path = require("path");
const blogRouter = require("../routes/blog")
const commentRouter = require("../routes/comment")
const app = express();
const connectDb = require('./mongoConfig')

const createServer = function(mongoDbUri) {
    
    connectDb(mongoDbUri)

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
  
    return app
}


module.exports = createServer;