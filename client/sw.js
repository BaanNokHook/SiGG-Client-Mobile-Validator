self.addEventListener('push', event => {
    const data = event.data.json();
    console.log("Title:" +data.title);
    self.registration.showNotification(data.title, {
      body: '{"subject": "Hello world", "total": 10}',
    });
  });