const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
