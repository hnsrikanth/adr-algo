const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const SECRET_KEY = process.env.JWT_SECRET;
const TokenBlacklist = require('../models/TokenBlacklist');

const authMiddleware = async (req, res, next) => {
	if (!SECRET_KEY) {
		throw new Error('JWT_SECRET is not defined in environment variables');
	}

	const authHeader = req.header('Authorization');

	if (!authHeader) {
		return res.status(401).json({ message: 'No token provided, authorization denied' });
	}

	if (!authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Invalid token format' });
	}

	const token = authHeader.replace('Bearer ', '');

	try {
		const blacklistedToken = await TokenBlacklist.findOne({ where: { token } });
		if (blacklistedToken) {
			return res.status(401).json({ message: 'Token has been invalidated' });
		}

		const decoded = jwt.verify(token, SECRET_KEY);

		// Ensure you are using the correct keys from the token payload
		req.user = {
			id: decoded.id,       // matches the key you used in the token
			username: decoded.username
		};

		// console.log(req.user);
		next();
	} catch (error) {
		console.error('Token verification failed:', error.message);
		return res.status(401).json({ message: 'Invalid token' });
	}
};

module.exports = authMiddleware;  