const authorizationMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Accès interdit' });
        }
        next();
    };
};

export default authorizationMiddleware;