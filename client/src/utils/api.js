import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: '/api',
});

class API {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getSettings() {
    const response = await this.axiosInstance.get('/settings');
    return response.data?.data;
  }

  /**
   * @param {object} settingsDTO School CI settings
   * @param {string} settingsDTO.repoName
   * @param {string} settingsDTO.buildCommand
   * @param {string} settingsDTO.mainBranch
   * @param {number} settingsDTO.period
   */
  async setSettings(settingsDTO) {
    const response = await this.axiosInstance.post('/settings', settingsDTO);
    return response.data?.data;
  }

  async getBuildsList(offset = 0, limit = 25) {
    const response = await this.axiosInstance.get(`/builds?offset=${offset}&limit=${limit}`);
    return response.data?.data;
  }

  async addBuild(commitHash) {
    const response = await this.axiosInstance.post(`/builds/${commitHash}`);
    return response.data?.data;
  }

  async getBuildDetails(buildId) {
    const response = await this.axiosInstance.get(`/builds/${buildId}`);
    return response.data?.data;
  }

  async getBuildLog(buildId) {
    const response = await this.axiosInstance.get(`/builds/${buildId}/logs`);
    return response.data;
  }
}

const ApiInstance = new API(axiosAPI);

export default ApiInstance;
