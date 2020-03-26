const axios = require('axios');
const https = require('https');
const config = require('../../config');

const axiosAPI = axios.create({
  baseURL: config.storageURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: { Authorization: config.storageApikey },
});

class Storage {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getSettings() {
    const response = await this.axiosInstance.get('/conf');
    return response.data;
  }

  /**
   * @param {object} settingsDTO School CI settings
   * @param {string} settingsDTO.repoName
   * @param {string} settingsDTO.buildCommand
   * @param {string} settingsDTO.mainBranch
   * @param {number} settingsDTO.period
   */
  async setSettings(settingsDTO) {
    const response = await this.axiosInstance.post('/conf', settingsDTO);
    return response.data;
  }

  async getBuildsList() {
    const response = await this.axiosInstance.get('/build/list');
    return response.data;
  }

  async getBuildLog(buildId) {
    const response = await this.axiosInstance.get(`/build/log?buildId=${buildId}`);
    return response.data;
  }

  async getBuildDetails(buildId) {
    const response = await this.axiosInstance.get(`/build/details?buildId=${buildId}`);
    return response.data;
  }

  /**
   * @param {object} buildCreateDTO Information about commit
   * @param {string} buildCreateDTO.commitMessage
   * @param {string} buildCreateDTO.commitHash
   * @param {string} buildCreateDTO.branchName
   * @param {string} buildCreateDTO.authorName
   */
  async buildInit(buildCreateDTO) {
    const response = await this.axiosInstance.post('/build/request', buildCreateDTO);
    return response.data;
  }

  /**
   * @param {object} buildStartDTO Information about started build process
   * @param {string} buildStartDTO.buildId
   * @param {string} buildStartDTO.dateTime dateTime in ISO format 2020-03-14T07:56:21.843Z
   */
  async buildStart(buildStartDTO) {
    const response = await this.axiosInstance.post('/build/start', buildStartDTO);
    return response.data;
  }

  /**
   * @param {object} buildFinishDTO Information about finished build process
   * @param {string} buildFinishDTO.buildId
   * @param {number} buildFinishDTO.duration duration in sec
   * @param {boolean} buildFinishDTO.success
   * @param {string} buildFinishDTO.buildLog
   */
  async buildFinish(buildFinishDTO) {
    const response = await this.axiosInstance.post('/build/finish', buildFinishDTO);
    return response.data;
  }

  /**
   * @param {object} buildStartDTO Information which build cancel
   * @param {string} buildStartDTO.buildId
   */
  async buildCancel(buildCancelDTO) {
    const response = await this.axiosInstance.post('/build/Cancel', buildCancelDTO);
    return response.data;
  }
}

const storageInstance = new Storage(axiosAPI);

module.exports = storageInstance;
