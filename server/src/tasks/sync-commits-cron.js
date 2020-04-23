const cron = require('node-cron');
const storage = require('../models/storage');
const SettingsSevice = require('../services/settingsService.js');
const { logResponseError } = require('../utils/logger');

const settingsService = new SettingsSevice(storage);

class SyncCommitsCron {
  constructor() {
    this.currentSettings = {};
    this.task = undefined;
  }

  async init() {
    try {
      const { data } = await storage.getSettings();
      if (data) this.currentSettings = data;

      if (this.currentSettings.period) {
        this.task = this.createCronTask();
        console.log(
          '✌️ Sync sommits cron is running every',
          this.currentSettings.period,
          'minutes!',
        );
      }
    } catch (error) {
      logResponseError('⚠️ Cannot get period for synchronization', error);
    }
  }

  update(newSettings) {
    this.currentSettings = newSettings;
    if (this.task) {
      this.task.stop();
      this.task.destroy();
    }

    if (!this.currentSettings.period) return;

    this.task = this.createCronTask();

    console.log('✌️ Sync sommits cron is running every', this.currentSettings.period, 'minutes!');
  }

  createCronTask() {
    return cron.schedule(`*/${this.currentSettings.period} * * * *`, async () => {
      try {
        await settingsService.updateRepository(this.currentSettings);
        await settingsService.addLastCommitToQueue(this.currentSettings);
      } catch (error) {
        console.error('Sync commits cron error', error);
      }
    });
  }
}

const syncCommitsCron = new SyncCommitsCron();

module.exports = syncCommitsCron;
