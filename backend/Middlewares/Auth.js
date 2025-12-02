const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
  // Let preflight CORS through
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Read the header in a safe way
  const authHeader = req.get('Authorization');
  console.log('Authorization header on server:', authHeader);

  if (!authHeader) {
    return res.status(403).json({
      message: 'Unauthorized, JWT token is require'
    });
  }

  // Support both "Bearer <token>" and "<token>"
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : authHeader;

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
