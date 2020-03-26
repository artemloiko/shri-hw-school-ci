const express = require('express');
const { setSettings, getSettings } = require('../../controllers/settingsController');

const router = express.Router();

router.get('/', getSettings);
router.post('/', setSettings);

module.exports = router;
