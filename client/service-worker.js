importScripts("https://js.pusher.com/beams/service-worker.js");


// //#Overriding default SDK behavior

// // PusherPushNotifications.onNotificationReceived = ({ pushEvent, payload }) => {

// //   console.log(JSON.stringify(payload));

// //     // NOTE: Overriding this method will disable the default notification

// //     // handling logic offered by Pusher Beams. You MUST display a notification

// //     // in this callback unless your site is currently in focus

// //     // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options

  
// //     // Your custom notification handling logic here 🛠️

// //     // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification

// //     // console.log('Bravo!')

// //     // pushEvent.waitUntil(

// //     //   self.registration.showNotification(payload.notification.title, {

// //     //     body: payload.notification.body,

// //     //     icon: payload.notification.icon,

// //     //     data: payload.data,

// //     //   })

// //     // );

// //   };



// //#Adding additional custom logic, keeping default behavior

PusherPushNotifications.onNotificationReceived = ({

  pushEvent,

  payload,

  handleNotification,

}) => {

  // Your custom notification handling logic here 🛠️

  // This method triggers the default notification handling logic offered by

  // the Beams SDK. This gives you an opportunity to modify the payload.

  // E.g. payload.notification.title = "A client-determined title!"

  console.log(payload.notification.title)

  pushEvent.waitUntil(handleNotification(payload));

};
