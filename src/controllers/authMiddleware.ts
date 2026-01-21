import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../models/authModel';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        if (user.lastLogout) {
            const tokenIssuedAt = decoded.iat;
            const logoutTime = Math.floor(user.lastLogout.getTime() / 1000);
            
            if (tokenIssuedAt < logoutTime) {
                return res.status(401).json({ message: 'Session expired. Please log in again.' });
            }
        }

        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired access token' });
    }
};