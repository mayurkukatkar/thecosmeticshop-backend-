const express = require('express');
const router = express.Router();
const { getBanners, createBanner, deleteBanner, updateBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBanners).post(protect, admin, createBanner);
router.route('/:id').delete(protect, admin, deleteBanner).put(protect, admin, updateBanner);

module.exports = router;
