const express = require("express");
var createError = require('http-errors');
const path = require("path");
const connectDb = require('./mongoConfig')

const blogRouter = require("../routes/blog")
const commentRouter = require("../routes/comment")
const authenticationRouter = require("../routes/authentication")
const signupRouter = require("../routes/signup")

require("./auth")

const createServer = function(mongoDbUri) {
    
    const app = express();
    connectDb(mongoDbUri)

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    // app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/blog', blogRouter)
    app.use('/comment', commentRouter)
    app.use('/signup', signupRouter)
    app.use('/auth', authenticationRouter)

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        console.log("caught 404")
        console.log(res)
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