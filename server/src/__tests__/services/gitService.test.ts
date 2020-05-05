import GitService from '../../services/gitService';
import { mocked } from 'ts-jest/utils';

const gitService = new GitService();

jest.mock('../../config', () => ({
  repoPath: 'src/__tests__/testRepo',
}));

beforeAll(() => {
  global.console.error = jest.fn();
});

afterAll(() => {
  mocked(global.console.error).mockRestore();
});

describe('Git Service', () => {
  describe('updateBranch', () => {
    test("Doesn't throw error for existing branch", async () => {
      await expect(gitService.updateBranch('master')).resolves.not.toThrow();
    }, 10000);
    test('Throw error for non existing branch', async () => {
      await expect(gitService.updateBranch('moster')).rejects.toThrow('Cannot find branch moster');
    }, 10000);
  });
  describe('checkIfRepositoryExists', () => {
    test('Return true for existing repo', async () => {
      const exist = await gitService.checkIfRepositoryExists(
        'https://github.com/artuom130/school-ci-test-repo.git',
      );

      expect(exist).toBe(true);
    });
    test('Return false for non existing repo', async () => {
      const exist = await gitService.checkIfRepositoryExists(
        'https://github.com/artuom130/non-existing-repo.git',
      );

      expect(exist).toBe(false);
    });
  });
  describe('getCurrentRepositoryName', () => {
    test('Return correct repository name', async () => {
      const repoName = await gitService.getCurrentRepositoryName();

      expect(repoName).toBe('artuom130/school-ci-test-repo');
    });
  });
  describe('getLastCommitHash', () => {
    test('Return correct last commit hash for master branch', async () => {
      const commitHash = await gitService.getLastCommitHash('master');

      expect(commitHash).toBe('914f07e');
    });
    test('Return correct last commit hash for dev branch', async () => {
      await gitService.updateBranch('dev');
      const commitHash = await gitService.getLastCommitHash('dev');

      expect(commitHash).toBe('94dc970');
    }, 10000);
  });
  describe('getCommitDetails', () => {
    test('Return correct details for commit 94dc970', async () => {
      const commitDetails = await gitService.getCommitDetails('94dc970');

      expect(commitDetails).toEqual({
        branchName: 'dev',
        authorName: 'Artem Loiko',
        commitMessage: 'Update README.md',
        commitHash: '94dc970',
      });
    });
    test('Return correct details for commit 914f07e', async () => {
      const commitDetails = await gitService.getCommitDetails('914f07e');

      expect(commitDetails).toEqual({
        branchName: 'master',
        authorName: 'Artem Loiko',
        commitMessage: 'Add Hello, world!',
        commitHash: '914f07e',
      });
    });
    test('Return correct details for commit e4fb1de', async () => {
      const commitDetails = await gitService.getCommitDetails('e4fb1de');

      expect(commitDetails).toEqual({
        branchName: 'master',
        authorName: 'Artem Loiko',
        commitMessage: 'Initial commit',
        commitHash: 'e4fb1de',
      });
    });
  });
});
