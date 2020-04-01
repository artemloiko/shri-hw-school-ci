const fs = require('fs-extra');

async function saveQueueToFile(buildQueue) {
  try {
    await fs.ensureFile('./temp/buildQueue.json');
  } catch (err) {
    await fs.mkdir('./temp');
  }
  return fs.writeJSON('./temp/buildQueue.json', buildQueue);
}
class BuildQueue {
  constructor(initQueue = []) {
    this.buildQueue = initQueue;
  }

  async enqueue(queueElem) {
    this.buildQueue.push(queueElem);
    await saveQueueToFile(this.buildQueue);
    console.log(`Commit ${queueElem} added to buildQueue!`);
  }

  async dequeue() {
    const dequeuedElem = this.buildQueue.shift();
    await saveQueueToFile(this.buildQueue);
    return dequeuedElem;
  }

  has(queueElem) {
    return this.buildQueue.includes(queueElem);
  }

  async remove(queueElem) {
    this.buildQueue = this.buildQueue.filter((elem) => elem !== queueElem);
    await saveQueueToFile(this.buildQueue);
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

let savedQueue;
try {
  savedQueue = JSON.parse(fs.readFileSync('./temp/buildQueue.json', 'utf-8'));
} catch (error) {
  fs.ensureDirSync('./temp');
  fs.writeJSONSync('./temp/buildQueue.json', []);
}

const buildQueue = new BuildQueue(savedQueue);

module.exports = buildQueue;
