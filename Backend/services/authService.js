const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthService {
    async register(userData) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const user = new User(userData);
        await user.save();
        
        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        return { token, user: { id: user._id, email: user.email, name: user.name } };
    }

    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user._id }, config.jwtSecret);
        return { token, user: { id: user._id, email: user.email, name: user.name } };
    }

    async getUserProfile(userId) {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUserProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');
        
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

module.exports = new AuthService(); 