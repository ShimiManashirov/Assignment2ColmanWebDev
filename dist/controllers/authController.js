"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logout = exports.login = exports.register = void 0;
const authModel_1 = __importDefault(require("../models/authModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const existingUser = yield authModel_1.default.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const userDoc = new authModel_1.default({
            username,
            password: hashedPassword,
            refreshTokens: []
        });
        const accessToken = jwt.sign({ userId: userDoc._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        const refreshTokenValue = jwt.sign({ userId: userDoc._id }, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey', { expiresIn: '7d' });
        userDoc.refreshTokens = [refreshTokenValue];
        yield userDoc.save();
        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken: refreshTokenValue
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        const user = yield authModel_1.default.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        const refreshTokenValue = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey', { expiresIn: '7d' });
        user.refreshTokens.push(refreshTokenValue);
        yield user.save();
        res.json({
            accessToken,
            refreshToken: refreshTokenValue
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { refreshToken: refreshTokenValue } = req.body;
    if (!refreshTokenValue) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey');
        const user = yield authModel_1.default.findById(decoded.userId);
        if (user) {
            const userDoc = user;
            userDoc.refreshTokens = ((_a = userDoc.refreshTokens) === null || _a === void 0 ? void 0 : _a.filter((token) => token !== refreshTokenValue)) || [];
            yield userDoc.save();
        }
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('Logout token error:', error);
        const msg = 'Invalid token';
        return res.status(401).json({ message: msg, error: process.env.NODE_ENV !== 'production' ? (error === null || error === void 0 ? void 0 : error.message) || String(error) : undefined });
    }
});
exports.logout = logout;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { refreshToken: refreshTokenValue } = req.body;
    if (!refreshTokenValue) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshTokenValue, process.env.REFRESH_TOKEN_SECRET || 'superrefreshsecretkey');
        const user = yield authModel_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        const userDoc = user;
        if (!((_a = userDoc.refreshTokens) === null || _a === void 0 ? void 0 : _a.includes(refreshTokenValue))) {
            console.log('Refresh - Token not found in DB. User tokens count:', (_b = userDoc.refreshTokens) === null || _b === void 0 ? void 0 : _b.length);
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        console.error('Refresh token error:', error);
        const msg = 'Invalid token';
        return res.status(401).json({ message: msg, error: process.env.NODE_ENV !== 'production' ? (error === null || error === void 0 ? void 0 : error.message) || String(error) : undefined });
    }
});
exports.refreshToken = refreshToken;
//# sourceMappingURL=authController.js.map