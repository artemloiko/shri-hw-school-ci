import axios, { AxiosInstance } from 'axios';
import {
  ConfigurationDTO,
  StorageResponce,
  ConfigurationModel,
  BuildModel,
} from '../../../server/typings/storage.interfaces';

const axiosAPI = axios.create({
  baseURL: '/api',
});

class API {
  constructor(private axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async getSettings() {
    const response = await this.axiosInstance.get<StorageResponce<ConfigurationModel>>('/settings');
    return response.data?.data;
  }

  async setSettings(settingsDTO: ConfigurationDTO) {
    await this.axiosInstance.post('/settings', settingsDTO);
  }

  async getBuildsList(offset = 0, limit = 25) {
    const response = await this.axiosInstance.get<StorageResponce<BuildModel[]>>(
      `/builds?offset=${offset}&limit=${limit}`,
    );
    return response.data?.data;
  }

  async addBuild(commitHash: string) {
    const response = await this.axiosInstance.post<StorageResponce<BuildModel>>(
      `/builds/${commitHash}`,
    );
    return response.data?.data;
  }

  async getBuildDetails(buildId: string) {
    const response = await this.axiosInstance.get<StorageResponce<BuildModel>>(
      `/builds/${buildId}`,
    );
    return response.data?.data;
  }

  async getBuildLog(buildId: string) {
    const response = await this.axiosInstance.get<StorageResponce<string>>(
      `/builds/${buildId}/logs`,
    );
    return response.data;
  }
}

const ApiInstance = new API(axiosAPI);

export default ApiInstance;
