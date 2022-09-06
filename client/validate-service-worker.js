importScripts("https://js.pusher.com/beams/service-worker.js");


#Overriding default SDK behavior

PusherPushNotifications.onNotificationReceived = ({ pushEvent, payload }) => {

  console.log(JSON.stringify(payload));

    // NOTE: Overriding this method will disable the default notification

    // handling logic offered by Pusher Beams. You MUST display a notification

    // in this callback unless your site is currently in focus

    // https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options

  
    // Your custom notification handling logic here 🛠️

    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification

    var express = require("express");
    var app = express();
    
    
    // Parse URL-encoded bodies (as sent by HTML forms)
    app.use(express.urlencoded({ extended: true }));
    
    // Parse JSON bodies (as sent by API clients)
    app.use(express.json());
    
    // expecting the shared secret as a lambda env varaible
    // OR if its not there, as the one and only cmd line argument, which *should*
    // be in the 3rd position (after node, and script name)
    var sharedSecret = process.env.sharedSecret;
    var localListen = false;
    if (sharedSecret == null || sharedSecret == "") {
      sharedSecret = process.argv[2];
    
      // we assume serverless uses the process env - so if we here, we're listening locally
      localListen = true;
    }
    
    console.log(
      "Shared secret: " +
        [sharedSecret].map((s) => s.slice(0, 4) + s.slice(4).replace(/\S/g, "*"))
    );
    
    // we need to try twice, first to prod, then to sandbox
    // this method does the raw sending
    function sendToMobile(url, receiptData, responseToClient, onCompletion) {
      var request = require("request");
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: url,
          json: {
            password: sharedSecret,
            "exclude-old-transactions": "true", //Sandbox doesn't seem to work with this! always got a non-latest bit
            "receipt-data": receiptData,
          },
        },
        function (error, response, body) {
          console.log("POST complete: ", url);
          console.log("Error: ", error);
          console.log("Status: ", response && response.statusCode);
          console.log("Body: " + JSON.stringify(body).substring(0, 256));
    
          // if we didn't get ok, then write it back
          if (!response || response.statusCode != 200) {
            console.log("got bad result, not trying again: ", response);
            responseToClient.sendStatus(400);
          }
    
          onCompletion(body, responseToClient);
        }
      );
    }
    
    // actually send the response to the client
    function processResponseFromMobile(MobileBody, responseToClient) {
      if (MobileBody.status == "21003") {
        console.log(
          "Authentication issue, likely missing/bad shared secret on our side."
        );
        responseToClient.sendStatus(500);
        return;
      }
    
      responseToClient.json(MobileBody);
    }
    
    // Access the parse results as request.body
    app.post("/verifyReceipt", function (request, response) {
      console.debug(`Processing post to /verifyReceipt ...`);
    
      // parse out the receipt-data
      var receiptData = request.body["receipt-data"];
      if (receiptData == null) {
        console.log("Didn't see receipt-data in message, bad request.");
        response.sendStatus(400);
        return;
      }
    
      // always try to prod first
      sendToMobile(
        urlProd,
        receiptData,
        response,
        function (MobileBody, responseToClient) {
          // if the response is a status of 21007, then resend to sandbox
          if (MobileBody["status"] == 21007) {
            console.log("Sending to sandbox...");
            sendToMobile(
              urlSandbox,
              receiptData,
              response,
              processResponseFromMobile
            );
          } else if (MobileBody["status"] == "21003") {
            console.log(
              "Authentication issue, likely missing/bad shared secret on our side."
            );
            response.sendStatus(500);
          } else {
            // can process this now
            console.log("Response is likely good...");
            processResponseFromMobile(MobileBody, responseToClient);
          }
        }
      );
    });
    
    app.get("/test", function (request, response) {
      console.log("test is good");
      response.sendStatus(200);
    });
    
    // for local
    if (localListen) {
      app.listen(3000);
      console.log("Listening locally...");
    }
    
    // for serverless
    var serverless = require("serverless-http");
    module.exports.handler = serverless(app);
    
    console.log("Started...");
}
    
  
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
