const asyncHandler = require('express-async-handler');
const Banner = require('../models/Banner');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({ isActive: true });
    res.json(banners);
});

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
    const banner = new Banner({
        image: '/images/sample-banner.jpg',
        title: 'New Banner',
        link: '/',
    });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
});

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
    const { image, title, link, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (banner) {
        banner.image = image;
        banner.title = title;
        banner.link = link;
        banner.isActive = isActive;

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } else {
        res.status(404);
        throw new Error('Banner not found');
    }
});

module.exports = { getBanners, createBanner, deleteBanner, updateBanner };
