const express = require('express');
const settingsController = require('../controllers/settingsController');

const router = express.Router();

router.use('/settings', settingsController);

module.exports = router;
