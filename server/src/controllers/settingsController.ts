import storage from '../models/storage';
import SettingsSevice from '../services/settingsService';
import { HttpError } from '../utils/customErrors';
import { logResponseError } from '../utils/logger';
import { Request, Response, NextFunction } from 'express';
import syncCommitsCron from '../tasks/sync-commits-cron';
import { StorageResponce, ConfigurationDTO, ConfigurationModel } from '@i/storage.interfaces';

const settingsService = new SettingsSevice(storage);

const getSettings = async (
  req: Request,
  res: Response<StorageResponce<ConfigurationModel>>,
  next: NextFunction,
) => {
  try {
    const currentSettings = await settingsService.getSettings();
    return res.json(currentSettings);
  } catch (err) {
    next(err);
  }
};

const setSettings = async (
  req: Request<{}, {}, ConfigurationDTO>,
  res: Response,
  next: NextFunction,
) => {
  const settingsDTO = req.body;
  try {
    await settingsService.updateRepository(settingsDTO);
    await settingsService.addLastCommitToQueue(settingsDTO);
    await settingsService.setSettings(settingsDTO);
    syncCommitsCron.update(settingsDTO);
    res.end();
  } catch (err) {
    if (!(err instanceof HttpError)) {
      logResponseError('/api/settings POST error', err);
    }
    next(err);
  }
};

export { getSettings, setSettings };
