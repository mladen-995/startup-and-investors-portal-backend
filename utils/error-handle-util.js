function handleInternalApiError(err, req, res, next) {
    if(!err.errorCode) {
        res.status(500).json({
            errorCode: 500,
            message: err.message,
        });
    } else {
        res.status(err.errorCode).json({
            errorCode: err.errorCode,
            message: err.message,
        });
    }
}

module.exports = {
    handleInternalApiError,
};
