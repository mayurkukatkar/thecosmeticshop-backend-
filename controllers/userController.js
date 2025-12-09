const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first.' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            phone: user.phone,
            address: user.address,
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ message: 'Server error during authentication' });
    }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            otp,
            otpExpires,
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        console.log(`OTP for ${email}: ${otp}`);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your email - The Cosmetic Shop',
                message: `
                    <h1>Welcome to The Cosmetic Shop!</h1>
                    <p>Please use the following OTP to verify your email:</p>
                    <h2 style="color: #EC4899;">${otp}</h2>
                    <p>This OTP is valid for 10 minutes.</p>
                `,
            });
        } catch (emailError) {
            console.error("Registration email error:", emailError);
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'Registration successful. OTP sent to your email.',
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Verify OTP
// @route   POST /api/users/verify
// @access  Public
const verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            phone: user.phone,
            address: user.address,
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error during verification' });
    }
};

// @desc    Resend OTP
// @route   POST /api/users/resend-otp
// @access  Public
const resendOtp = async (req, res) => {
    console.log("Resend OTP endpoint hit - New Version");
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        console.log(`Resend OTP for ${email}: ${otp}`);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Resend: Verify your email - The Cosmetic Shop',
                message: `
                    <h1>The Cosmetic Shop</h1>
                    <p>Here is your new OTP to verify your email:</p>
                    <h2 style="color: #EC4899;">${otp}</h2>
                    <p>This OTP is valid for 10 minutes.</p>
                `,
            });
            res.json({ message: 'OTP resent successfully' });
        } catch (emailError) {
            console.error("Email send error:", emailError);
            return res.status(500).json({ message: `Email failed: ${emailError.message}` });
        }
    } catch (error) {
        console.error("Resend OTP error:", error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser._id),
                phone: updatedUser.phone,
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            phone: user.phone,
            address: user.address,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { authUser, registerUser, verifyUser, getUserProfile, updateUserProfile, getUsers, deleteUser, resendOtp };
