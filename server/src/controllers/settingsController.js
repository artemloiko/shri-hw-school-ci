const express = require('express');
const storage = require('../storage');
const SettingsSevice = require('../services/settingsService.js');
const { logError } = require('../utils/logger');

const settingsService = new SettingsSevice(storage);
const router = express.Router();

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
    await settingsService.updateRepository(settingsDTO);
    await settingsService.addLastCommitToQueue(settingsDTO);
    return res.end();
  } catch (err) {
    logError('Error /api/settings POST', err);
    next(err);
  }
});

module.exports = router;
