const express = require('express');
const settingsController = require('../controllers/settings');

const router = express.Router();

router.use('/settings', settingsController);

module.exports = router;
