import { Request, Response } from 'express';
import User from '../models/authModel';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userDoc = new User({ 
            username, 
            password: hashedPassword, 
            refreshTokens: []
        });
        
        const accessToken = jwt.sign({ userId: userDoc._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        const refreshTokenValue = jwt.sign({ userId: userDoc._id }, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey', { expiresIn: '7d' });
        
        (userDoc as any).refreshTokens = [refreshTokenValue];
        await userDoc.save();
        
        res.status(201).json({ 
            message: 'User registered successfully',
            accessToken,
            refreshToken: refreshTokenValue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {  
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }  
        const isPasswordValid = await bcrypt.compare(password, user.password);  
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }  
        
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        const refreshTokenValue = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey', { expiresIn: '7d' });
        
        (user as any).refreshTokens.push(refreshTokenValue);
        await user.save();
        
        res.json({ 
            accessToken,
            refreshToken: refreshTokenValue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logout = async (req: Request, res: Response) => {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        const decoded: any = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        const userDoc = user as any;
        userDoc.refreshTokens = userDoc.refreshTokens?.filter((token: string) => token !== refreshTokenValue) || [];
        await userDoc.save();
        
        res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
        console.error('Logout token error:', error);
        const msg = 'Invalid token';
        return res.status(401).json({ message: msg, error: process.env.NODE_ENV !== 'production' ? error?.message || String(error) : undefined });
    }
};

const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken: refreshTokenValue } = req.body;

    if (!refreshTokenValue) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const decoded: any = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey');
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const userDoc = user as any;
        if (!userDoc.refreshTokens?.includes(refreshTokenValue)) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        
        res.json({ accessToken: newAccessToken });
    } catch (error: any) {
        console.error('Refresh token error:', error);
        const msg = 'Invalid token';
        return res.status(401).json({ message: msg, error: process.env.NODE_ENV !== 'production' ? error?.message || String(error) : undefined });
    }
};

export {
    register,
    login,
    logout,
    refreshToken
};