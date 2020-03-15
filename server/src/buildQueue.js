class BuildQueue {
  constructor() {
    this.buildQueue = [];
  }

  enqueue(queueElem) {
    this.buildQueue.push(queueElem);
  }

  dequeue() {
    return this.buildQueue.unshift();
  }

  has(queueElem) {
    return this.buildQueue.includes(queueElem);
  }

  remove(queueElem) {
    this.buildQueue = this.buildQueue.filter((elem) => elem !== queueElem);
  }
}

const buildQueue = new BuildQueue();

module.exports = buildQueue;
