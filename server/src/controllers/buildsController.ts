import { Request, Response, NextFunction } from 'express';
import storage from '../models/storage';
import BuildsSevice from '../services/buildsService';
import { logResponseError } from '../utils/logger';
import { StorageResponce, BuildModel } from '@i/storage.interfaces';

const buildsService = new BuildsSevice(storage);

interface BuildListQuery {
  limit: number;
  offset: number;
}

type BuildParam = {
  commitHash: string;
};

const getBuildList = async (
  req: Request<{}, {}, {}, BuildListQuery>,
  res: Response<StorageResponce<BuildModel[]>>,
  next: NextFunction,
) => {
  const { limit, offset } = req.query;
  try {
    const currentBuilds = await buildsService.getBuildsList(offset, limit);
    return res.json(currentBuilds);
  } catch (err) {
    next(err);
  }
};

const addBuild = async (
  req: Request<BuildParam>,
  res: Response<StorageResponce<BuildModel>>,
  next: NextFunction,
) => {
  const { commitHash } = req.params;
  try {
    const buildId = await buildsService.addToBuildQueue(commitHash);
    const commitDetails = await buildsService.getBuildDetails(buildId);
    return res.json(commitDetails);
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash POST', err);
    next(err);
  }
};

const getBuildDetails = async (
  req: Request<BuildParam>,
  res: Response<StorageResponce<BuildModel>>,
  next: NextFunction,
) => {
  const { commitHash } = req.params;
  try {
    const data = await buildsService.getBuildDetails(commitHash);
    return res.json(data);
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash GET', err);
    next(err);
  }
};

const getBuildLog = async (
  req: Request<BuildParam>,
  res: Response<StorageResponce<string>>,
  next: NextFunction,
) => {
  const { commitHash } = req.params;
  try {
    const data = await buildsService.getBuildLog(commitHash);
    return res.json({ data });
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash/logs GET', err);
    next(err);
  }
};

export { getBuildList, addBuild, getBuildDetails, getBuildLog };
