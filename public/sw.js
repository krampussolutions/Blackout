self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let payload = {
      title: 'Blackout Network',
      body: 'You have new activity waiting.',
      href: '/notifications',
    };

    try {
      const response = await fetch('/api/notifications/latest-unread', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data?.notification) {
          payload = data.notification;
        }
      }
    } catch {
      // Fall back to a generic alert if the latest notification cannot be fetched.
    }

    await self.registration.showNotification(payload.title, {
      body: payload.body,
      data: { href: payload.href },
      badge: '/og-image.png',
      icon: '/og-image.png',
      tag: 'blackout-network-notification',
      renotify: true,
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/notifications';

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windowClients) {
      if ('focus' in client) {
        client.navigate(href);
        return client.focus();
      }
    }

    if (clients.openWindow) {
      return clients.openWindow(href);
    }
  })());
});
