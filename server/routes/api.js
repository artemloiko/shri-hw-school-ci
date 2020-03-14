const express = require('express');
const settingsController = require('../controllers/settingsController');
const buildsController = require('../controllers/buildsController');

const router = express.Router();

router.use('/settings', settingsController);
router.use('/builds', buildsController);

module.exports = router;
