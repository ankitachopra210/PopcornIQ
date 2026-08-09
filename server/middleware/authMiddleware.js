import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // JWTs are conventionally sent in the Authorization header like:
  // "Bearer eyJhbGciOiJIUzI1NiIs..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verifies the token's signature using the same secret that created it.
      // Throws an error if the token is invalid, tampered with, or expired.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded.id is the userId we embedded back in generateToken.js.
      // We look up the user fresh from the DB (not just trust the token blindly),
      // and exclude the password field from what gets attached to the request.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      console.error('authMiddleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};