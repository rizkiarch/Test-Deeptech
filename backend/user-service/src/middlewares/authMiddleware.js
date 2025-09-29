import jwt from 'jsonwebtoken';
import Response from "../utils/response.js";
import ENV from "../config/env.js";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = Response.unauthorized('Authorization header missing or invalid');
        return res.status(response.statusCode).json(response);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        const response = Response.unauthorized('Invalid or expired token');
        return res.status(response.statusCode).json(response);
    }
};

export default authMiddleware;