const authMiddleware = (req, res, next) => {
    console.log('Auth middleware triggered');
    next();
};

module.exports = authMiddleware;
