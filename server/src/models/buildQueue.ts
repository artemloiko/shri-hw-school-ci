import fs from 'fs-extra';

export interface BuildQueueElem {
  commitHash: string;
  buildId: string;
}

class BuildQueue {
  buildQueue: BuildQueueElem[];
  constructor(initQueue: BuildQueueElem[] = []) {
    this.buildQueue = [...initQueue];
  }

  async saveQueueToFile(buildQueue: BuildQueueElem[]) {
    try {
      await fs.ensureFile('./temp/buildQueue.json');
    } catch (err) {
      await fs.mkdir('./temp');
    }
    return fs.writeJSON('./temp/buildQueue.json', buildQueue);
  }

  async enqueue(queueElem: BuildQueueElem) {
    this.buildQueue.push(queueElem);
    await this.saveQueueToFile(this.buildQueue);
    console.log(`New build ${queueElem.commitHash} - ${queueElem.buildId} added to buildQueue!`);
  }

  async dequeue() {
    const dequeuedElem = this.buildQueue.shift();
    await this.saveQueueToFile(this.buildQueue);
    return dequeuedElem;
  }

  has(commitHash: string) {
    return this.buildQueue.some((elem) => elem.commitHash === commitHash);
  }

  async remove({ commitHash, buildId }: BuildQueueElem) {
    this.buildQueue = this.buildQueue.filter(
      (elem) => elem.commitHash !== commitHash || elem.buildId !== buildId,
    );
    await this.saveQueueToFile(this.buildQueue);
  }

  size() {
    return this.buildQueue.length;
  }

  empty() {
    return !this.size();
  }

  front() {
    return this.buildQueue[0];
  }

  back() {
    return this.buildQueue[this.size() - 1];
  }
}

let savedQueue: BuildQueueElem[] | undefined;
try {
  savedQueue = JSON.parse(fs.readFileSync('./temp/buildQueue.json', 'utf-8'));
} catch (error) {
  fs.ensureDirSync('./temp');
  fs.writeJSONSync('./temp/buildQueue.json', []);
}

const buildQueue = new BuildQueue(savedQueue);

export { BuildQueue, buildQueue };
