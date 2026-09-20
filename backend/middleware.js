const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: 'Unauthorized', error: 'Invalid token' });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = authMiddleware;