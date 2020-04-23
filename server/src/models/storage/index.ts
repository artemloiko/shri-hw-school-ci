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
} from '../../../typings/storage.types';

const axiosAPI = axios.create({
  baseURL: config.storageURL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: { Authorization: `Bearer ${config.storageApikey}` },
});

class Storage {
  constructor(private axiosInstance: AxiosInstance) {}

  async getSettings(): Promise<StorageResponce<ConfigurationModel>> {
    const response = await this.axiosInstance.get('/conf');
    return response.data;
  }

  async deleteSettings(): Promise<void> {
    const response = await this.axiosInstance.delete('/conf');
    return response.data;
  }

  async setSettings(settingsDTO: ConfigurationDTO): Promise<void> {
    const response = await this.axiosInstance.post('/conf', settingsDTO);
    return response.data;
  }

  async getBuildsList(offset: number, limit: number): Promise<StorageResponce<BuildModel[]>> {
    const response = await this.axiosInstance.get(`/build/list?offset=${offset}&limit=${limit}`);
    return response.data;
  }

  async getBuildLog(buildId: string): Promise<StorageResponce<string>> {
    const response = await this.axiosInstance.get(`/build/log?buildId=${buildId}`);
    return response.data;
  }

  async getBuildDetails(buildId: string): Promise<StorageResponce<BuildModel>> {
    const response = await this.axiosInstance.get(`/build/details?buildId=${buildId}`);
    return response.data;
  }

  async buildInit(buildCreateDTO: BuildInitDTO): Promise<void> {
    const response = await this.axiosInstance.post('/build/request', buildCreateDTO);
    return response.data;
  }

  /**
   * dateTime is stored in ISO format 2020-03-14T07:56:21.843Z
   */
  async buildStart(buildStartDTO: BuildStartDTO): Promise<void> {
    const response = await this.axiosInstance.post('/build/start', buildStartDTO);
    return response.data;
  }

  /**
   * duration should be specified in seconds
   */
  async buildFinish(buildFinishDTO: BuildFinishDTO): Promise<void> {
    const response = await this.axiosInstance.post('/build/finish', buildFinishDTO);
    return response.data;
  }

  async buildCancel(buildCancelDTO: BuildCancelDTO): Promise<void> {
    const response = await this.axiosInstance.post('/build/Cancel', buildCancelDTO);
    return response.data;
  }
}

const storageInstance = new Storage(axiosAPI);

export default storageInstance;
