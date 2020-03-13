const express = require('express');
const SettingsSevice = require('../services/settingsService.js');

const settingsService = new SettingsSevice();
let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const currentSettings = await settingsService.getSettings();
    return res.json(currentSettings);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  // settingsService save settings
  // return res.end();
  next(new Error('post error'));
});

module.exports = router;
