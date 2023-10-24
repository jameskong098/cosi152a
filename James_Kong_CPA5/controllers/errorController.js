const httpStatus = require("http-status-codes");

exports.pageNotFoundError = (req, res, next) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error", { error_status : errorCode}); 
};

exports.internalServerError = (req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    res.status(errorCode);
    res.render("error", { error_status : errorCode}); 
};
