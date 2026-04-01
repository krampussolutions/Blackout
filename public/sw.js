self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let data = {
      title: 'Blackout Network',
      body: 'You have a new alert.',
      href: '/settings/notifications',
    };

    try {
      const response = await fetch('/api/notifications/latest-unread', { credentials: 'include' });
      if (response.ok) {
        const payload = await response.json();
        if (payload?.notification) {
          data = {
            title: 'Blackout Network',
            body: payload.notification.text || data.body,
            href: payload.notification.href || data.href,
          };
        }
      }
    } catch {}

    await self.registration.showNotification(data.title, {
      body: data.body,
      data: { href: data.href },
      badge: '/icons/icon-192.png',
      icon: '/icons/icon-192.png',
    });
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/settings/notifications';

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    for (const client of windowClients) {
      if ('focus' in client) {
        client.focus();
        if ('navigate' in client) {
          client.navigate(href);
        }
        return;
      }
    }

    await clients.openWindow(href);
  })());
});
