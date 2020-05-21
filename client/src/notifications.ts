import axios from 'axios';
import { urlBase64ToUint8Array } from './utils/urlBase64ToUint8Array';
const PUSH_KEY =
  'BKUWqPDuuuO-YTZ42oEQNKOdENd5pDykZM3cU1s_992RewC6kgEvYsfcpl0vHKeujsDtA-uZ1jhOUcV3H8HN-Wg';

export async function subscribe() {
  if (!('serviceWorker' in navigator)) return;
  if (!('PushManager' in window)) return;

  const subscribeStatus = await Notification.permission;
  if (subscribeStatus !== 'default') return;

  navigator.serviceWorker.ready
    .then(async (registration: ServiceWorkerRegistration) => {
      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_KEY),
      });
    })
    .then(async (pushSubscription) => {
      console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
      await axios.post('http://localhost:8080/subscribe', pushSubscription);
      return pushSubscription;
    })
    .catch((err) => {
      console.warn('Cannot subscribe', err);
    });
}
