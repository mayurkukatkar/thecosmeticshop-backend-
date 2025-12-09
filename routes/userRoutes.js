const express = require('express');
const {
    authUser,
    registerUser,
    verifyUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    resendOtp,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.post('/login', authUser);
router.post('/verify', verifyUser);
router.post('/resend-otp', resendOtp);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
