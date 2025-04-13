const errorHandler = (error, req, res, next) => {
    console.error(error); // Log ra để debug

    return res.status(500).json({
        status: false,
        message: "Something went wrong",
    });
};

module.exports = errorHandler;
