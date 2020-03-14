const express = require('express');
const storage = require('../storage');
const SettingsSevice = require('../services/settingsService.js');

const settingsService = new SettingsSevice(storage);
let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const currentSettings = await settingsService.getSettings();
    return res.json(currentSettings);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const settingsDTO = req.body;
  try {
    await settingsService.setSettings(settingsDTO);
    return res.end();
  } catch (err) {
    console.error(
      'Error /api/settings POST',
      err.message,
      err.stack,
      err.response && err.response.data
    );
    next(err);
  }
});

module.exports = router;
