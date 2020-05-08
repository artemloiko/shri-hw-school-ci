const logger = require('../utils/logger');
const webpush = require('web-push');

const vapidKeys = {
  publicKey:
    'BKUWqPDuuuO-YTZ42oEQNKOdENd5pDykZM3cU1s_992RewC6kgEvYsfcpl0vHKeujsDtA-uZ1jhOUcV3H8HN-Wg',
  privateKey: 'SN_1cPjUBoHIAX1r6f2mbd5ale9qOmppNr-gn9rh4rw',
};

webpush.setVapidDetails('mailto:chibi130@yandex.ru', vapidKeys.publicKey, vapidKeys.privateKey);

class SubscriptionService {
  constructor(db) {
    this.db = db;
  }
  isValidSaveRequest(req, res) {
    if (!req.body || !req.body.endpoint || !req.body.keys.auth || !req.body.keys.p256dh) {
      res.status(400);
      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          error: {
            id: 'no-endpoint',
            message: 'Subscription must have an endpoint.',
          },
        }),
      );
      return false;
    }
    return true;
  }

  saveSubscriptionToDatabase(subscription) {
    return new Promise((resolve, reject) => {
      this.db.insert(subscription, function (err, newDoc) {
        if (err) {
          reject(err);
          return;
        }

        resolve(newDoc._id);
      });
    });
  }
  getSubscriptionsFromDatabase() {
    return new Promise((resolve, reject) => {
      this.db.find({}, function (err, docs) {
        if (err) {
          reject(err);
          return;
        }

        resolve(docs);
      });
    });
  }
  deleteSubscriptionFromDatabase(id) {
    return new Promise((resolve, reject) => {
      this.db.remove({ _id: id }, {}, function (err, numRemoved) {
        if (err) {
          reject(err);
          return;
        }
        resolve(numRemoved);
      });
    });
  }

  saveSubscription(req, res) {
    if (!this.isValidSaveRequest(req, res)) {
      return;
    }

    return this.saveSubscriptionToDatabase(req.body)
      .then(function (subscriptionId) {
        logger.info('[SAVED SUBSCRIPTION]', subscriptionId);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ data: { success: true } }));
      })
      .catch(function (err) {
        console.log('err', err);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(
          JSON.stringify({
            error: {
              id: 'unable-to-save-subscription',
              message:
                'The subscription was received but we were unable to save it to our database.',
            },
          }),
        );
      });
  }

  sendPushes(data) {
    const dataToSend = JSON.stringify(data);
    return this.getSubscriptionsFromDatabase().then((subscriptions) => {
      let promiseChain = Promise.resolve();

      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return this.triggerPushMsg(subscription, dataToSend);
        });
      }

      return promiseChain;
    });
  }

  triggerPushMsg(subscription, dataToSend) {
    return webpush.sendNotification(subscription, dataToSend).catch((err) => {
      if (err.statusCode === 404 || err.statusCode === 410) {
        console.log('Subscription has expired or is no longer valid: ', err);
        return this.deleteSubscriptionFromDatabase(subscription._id);
      } else {
        console.error('Cannot send push', err);
      }
    });
  }
}

module.exports = {
  SubscriptionService,
};
