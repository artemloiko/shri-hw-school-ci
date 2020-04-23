import axios, { AxiosInstance } from 'axios';
import https from 'https';
import config from '../../config';
import {
  StorageResponce,
  ConfigurationModel,
  ConfigurationDTO,
  BuildModel,
  BuildInitDTO,
  BuildStartDTO,
  BuildFinishDTO,
  BuildCancelDTO,
  BuildInitResponse,
} from '@i/storage.interfaces';

const axiosAPI = axios.create({
  baseURL: config.storageURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: { Authorization: `Bearer ${config.storageApikey}` },
});

export class Storage {
  constructor(private axiosInstance: AxiosInstance) {}

  async getSettings() {
    const response = await this.axiosInstance.get<StorageResponce<ConfigurationModel>>('/conf');
    return response.data;
  }

  async deleteSettings() {
    await this.axiosInstance.delete('/conf');
  }

  async setSettings(settingsDTO: ConfigurationDTO) {
    await this.axiosInstance.post('/conf', settingsDTO);
  }

  async getBuildsList(offset: number = 0, limit: number = 25) {
    const response = await this.axiosInstance.get<StorageResponce<BuildModel[]>>(
      `/build/list?offset=${offset}&limit=${limit}`,
    );
    return response.data;
  }

  async getBuildLog(buildId: string) {
    const response = await this.axiosInstance.get<StorageResponce<string>>(
      `/build/log?buildId=${buildId}`,
    );
    return response.data;
  }

  async getBuildDetails(buildId: string) {
    const response = await this.axiosInstance.get<StorageResponce<BuildModel>>(
      `/build/details?buildId=${buildId}`,
    );
    return response.data;
  }

  async buildInit(buildCreateDTO: BuildInitDTO) {
    const response = await this.axiosInstance.post<StorageResponce<BuildInitResponse>>(
      '/build/request',
      buildCreateDTO,
    );
    return response.data;
  }

  /**
   * dateTime is stored in ISO format 2020-03-14T07:56:21.843Z
   */
  async buildStart(buildStartDTO: BuildStartDTO) {
    await this.axiosInstance.post('/build/start', buildStartDTO);
  }

  /**
   * duration should be specified in seconds
   */
  async buildFinish(buildFinishDTO: BuildFinishDTO) {
    await this.axiosInstance.post('/build/finish', buildFinishDTO);
  }

  async buildCancel(buildCancelDTO: BuildCancelDTO) {
    await this.axiosInstance.post('/build/Cancel', buildCancelDTO);
  }
}

const storageInstance = new Storage(axiosAPI);

export default storageInstance;
