const express = require('express');
const router = express.Router();
const zod = require('zod');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware');
const { Account } = require('../db');

const signupSchema = zod.object({
    username: zod.string().min(3).max(20),
    password: zod.string().min(6),
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
});

const signinSchema = zod.object({
    username: zod.string().min(3).max(20),
    password: zod.string().min(6),
});

const updateUserSchema = zod.object({
    password: zod.string().min(6),
    firstName: zod.string().min(3).max(20),
    lastName: zod.string().min(3).max(20),
});

router.post('/signup', async (req, res) => {
    const { success, data, error } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.message });
    }
    const { username, password, firstName, lastName } = data;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ username, password, firstName, lastName });
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000;
    })
    const token = jwt.sign({
        userId
    }, JWT_SECRET)
    res.status(200).json({ message: 'User registered successfully', token: token });
});

router.post('/signin', async (req, res) => {
    const { success, data, error } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.message });
    }
    const { username, password } = data;
    const existingUser = await User.findOne({ username });
    if (!existingUser || existingUser.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET);
    res.status(200).json({ message: 'Login successful', token, user: existingUser });
});


router.put('/', authMiddleware, async (req, res) => {
    const { success, data, error } = updateUserSchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({ message: error.message });
    }
    const { password, firstName, lastName } = data;
    await User.updateOne({ _id: req.userId }, { password, firstName, lastName })
    res.status(200).json({ message: 'User updated successfully' });
});

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    res.status(200).json({
        message: 'Users fetched successfully',
        users: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
});

module.exports = router;