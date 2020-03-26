const express = require('express');
const settingsRoutes = require('./settings');
const buildsRoutes = require('./builds');

const router = express.Router();

router.use('/settings', settingsRoutes);
router.use('/builds', buildsRoutes);

module.exports = router;
