class SettingsService {
  constructor(storage) {
    this.storage = storage;
  }
  async getSettings() {
    return this.storage.getSettings();
  }
  async setSettings(settingsDTO) {
    return this.storage.setSettings(settingsDTO);
  }
}

module.exports = SettingsService;
