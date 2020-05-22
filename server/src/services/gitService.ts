import fs from 'fs-extra';
import path from 'path';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';

import config from '../config';
import GitOutputParser from './GitOutputParser';
import { HttpError, ErrorCode } from '../utils/customErrors';

const exec = promisify(execCb);
const { repoPath } = config;

export default class GitService {
  async updateRepository(repoName: string, mainBranch: string) {
    const currentRepoName = await this.getCurrentRepositoryName();
    if (currentRepoName === repoName) {
      await this.updateBranch(mainBranch);
      return;
    }

    await this.cloneRepository(repoName);
    await this.updateBranch(mainBranch);
  }

  async updateBranch(branchName: string) {
    try {
      await exec(`cd ${repoPath} && git fetch && git checkout ${branchName} && git pull`);
    } catch (error) {
      console.error('GitService.updateRepository error\n', error.stderr);
      throw new HttpError(
        `Cannot find branch ${branchName} in repo`,
        400,
        ErrorCode.GIT_CANNOT_FIND_BRANCH,
      );
    }
  }

  async cloneRepository(repoName: string) {
    try {
      const repoUrl = `git@github.com/${repoName}.git`;
      if (!(await this.checkIfRepositoryExists(repoUrl))) {
        throw new Error('Repository does not exist');
      }
      await fs.remove(path.join('./', repoPath));
      await exec(`git clone ${repoUrl} ${repoPath}`);
    } catch (error) {
      console.error('GitService.updateRepository error\n', error.stderr);
      throw new HttpError(
        `Cannot find ${repoName} repository`,
        400,
        ErrorCode.GIT_CANNOT_FIND_REPO,
      );
    }
  }

  async checkIfRepositoryExists(repoUrl: string) {
    try {
      await exec(`git ls-remote ${repoUrl}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getCurrentRepositoryName() {
    try {
      const { stdout } = await exec(`cd ${repoPath} && git remote get-url origin`);
      return GitOutputParser.parseRepositoryName(stdout);
    } catch (error) {
      return '';
    }
  }

  async getLastCommitHash(branchName: string) {
    try {
      const { stdout: hash } = await exec(
        `cd ${repoPath} && git log --pretty=format:%h -1 ${branchName}`,
      );
      return hash;
    } catch (error) {
      console.error('GitService.getLastCommitHash error\n', error.stderr);
      throw new HttpError(
        `Cannot find branch ${branchName} in repo`,
        400,
        ErrorCode.GIT_CANNOT_FIND_BRANCH,
      );
    }
  }

  async getCommitDetails(commitHash: string) {
    try {
      const SPLITTER = '{SPLIT}';
      const { stdout: log } = await exec(
        `cd ${repoPath} && git log --pretty="%an${SPLITTER}%s${SPLITTER}%D" -1 ${commitHash}`,
      );
      const parsedData = GitOutputParser.parseLog(log, SPLITTER);
      let { branchName } = parsedData;

      if (!branchName) {
        const { stdout } = await exec(`cd ${repoPath} && git name-rev ${commitHash}`);
        branchName = GitOutputParser.parseBranch(stdout);
      }
      return { ...parsedData, commitHash, branchName };
    } catch (error) {
      console.error('GitService.getCommitDetails error\n', error.stderr);
      throw new HttpError(
        `Cannot get detils of commit ${commitHash}`,
        400,
        ErrorCode.GIT_CANNOT_FIND_COMMIT,
      );
    }
  }
}
