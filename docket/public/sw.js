
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "DueBird",
      body: event.data?.text() || "You have a new notification.",
    };
  }

  const title = data.title || "DueBird";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "You have an upcoming assignment.",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      tag: data.tag || "duebird-notification",
      data: { url: data.url || "/dashboard" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = new URL(
    event.notification.data?.url || "/dashboard",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(
      (windowClients) => {
        for (const client of windowClients) {
          if (client.url.startsWith(self.location.origin)) {
            client.navigate(url);
            return client.focus();
          }
        }

        return clients.openWindow(url);
      }
    )
  );
});
