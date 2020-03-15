const express = require('express');
const storage = require('../storage');
const SettingsSevice = require('../services/settingsService.js');
const { HttpError } = require('../utils/customErrors');
const { logResponseError } = require('../utils/logger');

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
    await settingsService.updateRepository(settingsDTO);
    await settingsService.addLastCommitToQueue(settingsDTO);
    await settingsService.setSettings(settingsDTO);
    return res.end();
  } catch (err) {
    if (!(err instanceof HttpError)) {
      logResponseError('/api/settings POST error', err);
    }
    next(err);
  }
});

module.exports = router;
