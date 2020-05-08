type NotificationCode = 'BUILD_SUCCESS' | 'BUILD_FAIL';
type PushNotificationPayload = {
  title: string;
  body?: string;
  code: NotificationCode;
  data?: any;
};
type NotificationData = (NotificationOptions & { title: string }) | null;

function generateNotificationData(payload: string): NotificationData {
  let notifData: NotificationData = null;
  try {
    const parsedData = JSON.parse(payload);
    if (!parsedData.code || !parsedData.title) throw new Error();

    const { code, body, title, data } = parsedData as PushNotificationPayload;
    let icon;
    switch (code) {
      case 'BUILD_SUCCESS':
        icon = '/success.svg';
        break;
      case 'BUILD_FAIL':
        icon = '/fail.svg';
        break;
    }

    notifData = {
      title,
      body,
      icon,
      data,
    };
  } catch (error) {
    console.log('Push payload is wrong', payload);
    notifData = {
      title: payload,
    };
  }

  return notifData;
}

self.addEventListener('push', function (event) {
  if (!event.data) {
    console.log('Push notification without data');
    return;
  }
  const payload = event.data.text();
  const notificationData = generateNotificationData(payload);
  console.log('[PUSH EVENT]', notificationData);
  if (notificationData) {
    event.waitUntil(self.registration.showNotification(notificationData.title, notificationData));
  }
});

self.addEventListener('notificationclick', function (event) {
  const notificationData = event.notification.data;
  console.log('[NOTIFICATION CLICK]', notificationData);
  if (notificationData?.buildId) {
    const urlToOpen = new URL(`/details/${notificationData.buildId}`, self.location.origin).href;
    const promiseChain = self.clients.openWindow(urlToOpen);
    event.waitUntil(promiseChain);
  }
});
