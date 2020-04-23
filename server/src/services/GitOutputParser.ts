export interface ParsedLogOutput {
  authorName: string;
  commitMessage: string;
  branchName?: string;
}

export default class GitOutputParser {
  /**
   * Parse git log and returns object with parsed data
   * @param {*} log - string of git stdout
   * @param {*} splitter - splitter used for separating values
   * @returns {{authorName, commitMessage, branchName}}
   */
  static parseLog(log: string, splitter: string): ParsedLogOutput {
    const authorName = log.split(splitter)[0];
    const commitMessage = log.split(splitter)[1];
    const branches = log.split(splitter)[2];
    // branches example "HEAD -> branch, origin/branch, branch"
    const branchName = branches
      .split(', ')[0]
      .trim()
      .replace(/\w+\s->\s/, '')
      .replace(/origin\//, '');

    return {
      authorName,
      commitMessage,
      branchName,
    };
  }

  /**
   *
   * @param {string} stdout - stdout of the name-rev command
   * @returns {string} - parsed branch name
   */
  static parseBranch(stdout: string): string {
    const branchInfo = stdout.split(' ')[1];
    const branchName = branchInfo
      .trim()
      .replace(/origin\//, '')
      .replace(/remotes\//, '')
      .replace(/[~^].+$/, '');
    return branchName;
  }

  /**
   *
   * @param {string} stdout - stdout of git remote get-url
   * @returns {string} - parsed branch name
   */
  static parseRepositoryName(stdout: string): string {
    // /(?<=\/\/.+\..+\/).+\/.+(?=\.git\n?$)/ matches from url https://example.com/user-name/repo-name.git
    // /(?<=git@.+:).+\/.+(?=\.git\n?$)/ matches from ssh git@example.com:user-name/repo-name.git
    const matchRepoNameRegex = /(?<=\/\/.+\..+\/).+\/.+(?=\.git\n?$)|(?<=git@.+:).+\/.+(?=\.git\n?$)/;
    const repoOriginLink = stdout;
    const nameMatch = repoOriginLink.match(matchRepoNameRegex);
    return nameMatch ? nameMatch[0] : '';
  }
}
