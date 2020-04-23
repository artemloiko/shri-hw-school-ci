const storage = require('../models/storage');
const SettingsSevice = require('../services/settingsService.js');
const { HttpError } = require('../utils/customErrors');
const { logResponseError } = require('../utils/logger');

const settingsService = new SettingsSevice(storage);
const syncCommitsCron = require('../tasks/sync-commits-cron');

const getSettings = async (req, res, next) => {
  try {
    const currentSettings = await settingsService.getSettings();
    return res.json(currentSettings);
  } catch (err) {
    next(err);
  }
};

const setSettings = async (req, res, next) => {
  const settingsDTO = req.body;
  try {
    await settingsService.updateRepository(settingsDTO);
    await settingsService.addLastCommitToQueue(settingsDTO);
    await settingsService.setSettings(settingsDTO);
    syncCommitsCron.update(settingsDTO);
    return res.end();
  } catch (err) {
    if (!(err instanceof HttpError)) {
      logResponseError('/api/settings POST error', err);
    }
    next(err);
  }
};

module.exports = {
  getSettings,
  setSettings,
};
