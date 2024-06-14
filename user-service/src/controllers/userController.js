const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, mobileNo, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, mobileNo, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret');
        res.status(201).json({ token, userId: newUser._id });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error signing up' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret');
        res.status(200).json({ token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().lean().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean().select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Check if the password is being updated
        if (req.body.password) {
            // Encrypt the password
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.searchUser = async (req, res) => {
    try {
        const users = await User.find({ name: new RegExp(req.params.name, 'i') }).lean().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error searching user' });
    }
};

exports.followUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const currentUser = await User.findById(req.user.userId);
        if (!currentUser.following.includes(user._id)) {
            currentUser.following.push(user._id);
            user.followers.push(currentUser._id);
            await currentUser.save();
            await user.save();
        }
        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error following user' });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const currentUser = await User.findById(req.user.userId);
        currentUser.following = currentUser.following.filter(id => id.toString() !== user._id.toString());
        user.followers = user.followers.filter(id => id.toString() !== currentUser._id.toString());
        await currentUser.save();
        await user.save();
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user' });
    }
};
