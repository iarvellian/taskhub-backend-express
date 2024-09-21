const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data to the request object
    console.log(req.cookies.jwt)
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;