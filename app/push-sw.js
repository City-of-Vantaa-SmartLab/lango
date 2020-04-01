/* eslint-disable no-restricted-globals */

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    if (!self.Notification || self.Notification.permission !== 'granted') {
      console.debug('Not showing push notification, permission denied', event);
      return;
    }

    const d = event.data.json();

    const { message, friendshipId, senderFirstName } = d.data || {};

    console.debug('Push data', d.data);

    const clients = await self.clients.matchAll({ type: 'window' });

    if (clients.length === 0) {
      console.debug('Not showing push notification, no clients found');
      return;
    }

    const isAlreadyInChat = clients.some(
      ({ url, visibilityState }) => visibilityState === 'visible' && url.endsWith(`/friendships/${friendshipId}/chat`)
    );

    if (isAlreadyInChat) {
      console.debug('Not showing push notification, already in corresponding chat');
      return;
    }

    const title = senderFirstName
      ? `Uusi viesti käyttäjältä ${senderFirstName}`
      : 'Uusi viesti';

    const options = {
      body: message,
      icon: 'icon-96x96.png',
      // TODO: badge?
      vibrate: [100, 50, 100],
      data: { friendshipId },
    };

    console.debug('Showing push notification');

    await self.registration.showNotification(title, options);

    console.debug('Push notification shown!');
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  if (event.notification.data.friendshipId) {
    event.waitUntil(
      self.clients.matchAll({ type: 'window' })
        .then((clientList) => {
          const visibleClient = clientList.find(({ visibilityState }) => visibilityState === 'visible');

          if (visibleClient === undefined) {
            console.debug('Push notification clicked, opening new window');
            self.clients.openWindow(`/friendships/${event.notification.data.friendshipId}/chat`);
            return;
          }

          console.debug('Push notification clicked, opening existing window');
          visibleClient.navigate(`/friendships/${event.notification.data.friendshipId}/chat`);
          visibleClient.focus();
        })
    );
  }
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(
    Promise.all([
      event.request.json(),
      self.registration.getNotifications(),
    ])
      .then(([requestBody, notifications]) => {
        // FIXME: This is not a reliable test
        const chatOpened = 'query' in requestBody
          && requestBody.query.includes('updateUserLastSeenInFriendship')
          && 'friendshipId' in requestBody.variables;
        if (!chatOpened) {
          return;
        }

        notifications
          .filter(({ data }) => data.friendshipId === requestBody.variables.friendshipId)
          .forEach((notification) => notification.close());
      }),
  );
});
