const storage = require('../storage');

class SettingsService {
  async getSettings() {
    return storage.getSettings();
  }
}

module.exports = SettingsService;
