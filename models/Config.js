const mongoose = require('mongoose');

const configSchema = mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Config = mongoose.model('Config', configSchema);

module.exports = Config;
