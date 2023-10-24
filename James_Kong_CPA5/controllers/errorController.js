const httpStatus = require("http-status-codes");

exports.pageNotFoundError = (error, req, res, next) => {
    let errorCode = httpStatus.NOT_FOUND;
    if (!error) {
        next()
    }
    else if (error.status == errorCode) {
        console.log("pageNotFoundError Controller Entered")
        //console.log(`ERROR occurred: ${error.stack}`);
        res.status(errorCode);
        res.render("error", { error_status : errorCode}); 
    }
};

exports.internalServerError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    if (!error) {
        next()
    }
    else if (error.status == errorCode) {
        console.log("internalServerError Controller Entered")
        //console.log(`ERROR occurred: ${error.stack}`);
        res.status(errorCode);
        res.render("error", { error_status : errorCode}); 
    }
};
