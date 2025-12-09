const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Ensure we have a status code
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // If no status code was set, check the error
    if (!statusCode || statusCode === 200) {
        statusCode = err.statusCode || 500;
    }

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };
