const GitOutputParser = require('../../services/GitOutputParser');

describe('GitOutputParser service', () => {
  describe('parseLog', () => {
    test('Return parsed data in correct format', () => {
      const SPLITTER = '{SPLIT}';
      const input = `Author${SPLITTER}Message${SPLITTER}master`;
      const parsedData = GitOutputParser.parseLog(input, SPLITTER);

      expect(parsedData).toEqual({
        branchName: 'master',
        authorName: 'Author',
        commitMessage: 'Message',
      });
    });
    test('Return correct authorName and commitMessage', () => {
      const SPLITTER = '{SPLIT}';
      const input = `Artem Loiko${SPLITTER}Update testing readme${SPLITTER}`;
      const { commitMessage, authorName } = GitOutputParser.parseLog(input, SPLITTER);

      expect(authorName).toBe('Artem Loiko');
      expect(commitMessage).toBe('Update testing readme');
    });
    test.each([
      ['Author|Message|HEAD -> master, origin/master, master', 'master'],
      ['Author|Message|HEAD -> master', 'master'],
      ['Author|Message|origin/master', 'master'],
      ['Author|Message|master', 'master'],
    ])('Return correct branchName master for %s', (input, expected) => {
      const { branchName } = GitOutputParser.parseLog(input, '|');

      expect(branchName).toBe(expected);
    });
  });
  describe('parseBranch', () => {
    test.each([
      ['587602e master', 'master'],
      ['dab7191 master~15', 'master'],
      ['dab7191 master^2', 'master'],
      ['587602e master^1~2', 'master'],
      ['5ab674f remotes/origin/dev', 'dev'],
      ['07f9f03 remotes/origin/dev~1', 'dev'],
      ['07f9f03 remotes/origin/dev^1', 'dev'],
      ['07f9f03 remotes/origin/dev^1~2', 'dev'],
      ['07f9f03 remotes/origin/dev~74', 'dev'],
    ])('Return correct branchName for %s', (input, expected) => {
      const branchName = GitOutputParser.parseBranch(input);

      expect(branchName).toBe(expected);
    });
  });
  describe('parseRepositoryName', () => {
    test.each([
      ['http://github.com/user-name/repo-name.git', 'user-name/repo-name'],
      ['https://github.com/user-name/repo-name.git', 'user-name/repo-name'],
      ['https://bitbucket.org/user-name/repo-name.git', 'user-name/repo-name'],
      ['https://subdomain.domain.tech/user-name/repo-name.git', 'user-name/repo-name'],
    ])('Return correct repository name for http format %s', (input, expected) => {
      const repoName = GitOutputParser.parseRepositoryName(input);

      expect(repoName).toBe(expected);
    });
    test.each([
      ['git@example.com:user-name/repo-name.git', 'user-name/repo-name'],
      ['git@bitbucket.org:user-name/repo-name.git', 'user-name/repo-name'],
      ['git@github.com:user-name/repo-name.git', 'user-name/repo-name'],
      ['git@long.domain.tech:user-name/repo-name.git', 'user-name/repo-name'],
    ])('Return correct repository name for ssh format %s', (input, expected) => {
      const repoName = GitOutputParser.parseRepositoryName(input);

      expect(repoName).toBe(expected);
    });
  });
});
