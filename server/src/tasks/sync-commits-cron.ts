import cron, { ScheduledTask } from 'node-cron';
import storage from '../models/storage';
import SettingsSevice from '../services/settingsService';
import { logResponseError } from '../utils/logger';
import { ConfigurationDTO } from '@i/storage.interfaces';

const settingsService = new SettingsSevice(storage);

class SyncCommitsCron {
  public currentSettings: ConfigurationDTO | undefined;
  private task: ScheduledTask | undefined;

  constructor() {
    this.task = undefined;
  }

  async init(): Promise<void> {
    try {
      const { data } = await storage.getSettings();
      if (data) this.currentSettings = data;

      if (this.currentSettings?.period) {
        this.task = this.createCronTask();
        console.log(
          '✌️ Sync sommits cron is running every',
          this.currentSettings?.period,
          'minutes!',
        );
      }
    } catch (error) {
      logResponseError('⚠️ Cannot get period for synchronization', error);
    }
  }

  update(newSettings: ConfigurationDTO): void {
    this.currentSettings = newSettings;
    if (this.task) {
      this.task.stop();
      this.task.destroy();
    }

    if (!this.currentSettings?.period) return;

    this.task = this.createCronTask();

    console.log('✌️ Sync sommits cron is running every', this.currentSettings?.period, 'minutes!');
  }

  createCronTask(): ScheduledTask {
    return cron.schedule(`*/${this.currentSettings?.period} * * * *`, async () => {
      if (!this.currentSettings) return;
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

export default syncCommitsCron;
