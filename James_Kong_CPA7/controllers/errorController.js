const httpStatus = require("http-status-codes");

exports.pageNotFoundError = (req, res, next) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error", { error_status : errorCode}); 
};

exports.internalServerError = (err, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(err)
    res.status(errorCode);
    res.render("error", { error_status : errorCode}); 
};
