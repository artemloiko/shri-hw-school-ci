const storage = require('../models/storage');
const BuildsSevice = require('../services/buildsService.js');
const { logResponseError } = require('../utils/logger');

const buildsService = new BuildsSevice(storage);

const getBuildList = async (req, res, next) => {
  try {
    const currentBuilds = await buildsService.getBuildsList();
    return res.json(currentBuilds);
  } catch (err) {
    next(err);
  }
};

const addBuild = async (req, res, next) => {
  const { commitHash } = req.params;
  try {
    await buildsService.addToBuildQueue(commitHash);
    return res.end();
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash POST', err);
    next(err);
  }
};

const getBuildDetails = async (req, res, next) => {
  const { commitHash } = req.params;
  try {
    const data = await buildsService.getBuildDetails(commitHash);
    return res.json(data);
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash GET', err);
    next(err);
  }
};

const getBuildLog = async (req, res, next) => {
  const { commitHash } = req.params;
  try {
    const data = await buildsService.getBuildLog(commitHash);
    return res.json(data);
  } catch (err) {
    logResponseError('Error /api/builds/:commitHash/logs GET', err);
    next(err);
  }
};

module.exports = {
  getBuildList,
  addBuild,
  getBuildDetails,
  getBuildLog,
};
