const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // 1. Get token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Add user info to the request object
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { protect };