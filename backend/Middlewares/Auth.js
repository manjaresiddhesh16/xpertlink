const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    // Let CORS preflight pass
    if (req.method === 'OPTIONS') {
        return next();
    }

    // Use Express helper to read header (case-insensitive)
    const authHeader = req.get('Authorization');
    console.log('Authorization header on server:', authHeader);

    if (!authHeader) {
        return res.status(403).json({
            message: 'Unauthorized, JWT token is require'
        });
    }

    // Support "Bearer <token>" and plain "<token>"
    const token = authHeader.replace(/^Bearer\s+/i, '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verify error:', err);
        return res.status(403).json({
            message: 'Unauthorized, JWT token wrong or expired'
        });
    }
};

module.exports = ensureAuthenticated;
