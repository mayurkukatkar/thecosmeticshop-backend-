const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to retrieve WhatsApp number config
router.get('/public/whatsappNumber', (req, res, next) => {
    req.params.key = 'whatsappNumber';
    getConfig(req, res, next);
});

router.route('/:key')
    .get(protect, admin, getConfig)
    .put(protect, admin, updateConfig);

module.exports = router;
