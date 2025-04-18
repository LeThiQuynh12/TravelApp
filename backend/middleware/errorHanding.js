const errorHandler = (error, req, res, next) => {
    console.error(error); // Log ra để debug

    return res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
};

module.exports = errorHandler;
