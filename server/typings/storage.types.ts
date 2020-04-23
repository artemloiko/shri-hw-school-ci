export interface ConfigurationModel {
  id: string;
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}

export interface ConfigurationDTO {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}

export interface ConfigurationGetResponse {
  data: ConfigurationModel | {};
}

export interface BuildModel {
  id: string;
  configurationId: string;
  buildNumber: number;
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
  status: BuildStatus;
  start?: string;
  duration?: number;
}

export type BuildStatus = 'Waiting' | 'InProgress' | 'Success' | 'Fail' | 'Canceled';

export interface BuildInitDTO {
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
}

export interface BuildStartDTO {
  buildId: string;
  dateTime: string;
}

export interface BuildCancelDTO {
  buildId: string;
}

export interface BuildFinishDTO {
  buildId: string;
  duration: number;
  success: boolean;
  buildLog: string;
}

export interface StorageResponce<T> {
  data: T;
}
