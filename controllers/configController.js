const asyncHandler = require('express-async-handler');
const Config = require('../models/Config');

// @desc    Get specific config by key
// @route   GET /api/config/:key
// @access  Private/Admin
const getConfig = asyncHandler(async (req, res) => {
    const config = await Config.findOne({ key: req.params.key });

    if (config) {
        res.json(config);
    } else {
        // Return default values if config doesn't exist yet
        if (req.params.key === 'deliveryEmail') {
            res.json({ key: 'deliveryEmail', value: '' });
            return;
        }
        res.status(404);
        throw new Error('Config not found');
    }
});

// @desc    Update specific config
// @route   PUT /api/config/:key
// @access  Private/Admin
const updateConfig = asyncHandler(async (req, res) => {
    const { value } = req.body;

    let config = await Config.findOne({ key: req.params.key });

    if (config) {
        config.value = value;
        const updatedConfig = await config.save();
        res.json(updatedConfig);
    } else {
        const newConfig = new Config({
            key: req.params.key,
            value: value
        });
        const createdConfig = await newConfig.save();
        res.status(201).json(createdConfig);
    }
});

module.exports = {
    getConfig,
    updateConfig
};
