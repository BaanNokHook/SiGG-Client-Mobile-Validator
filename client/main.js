const triggerPush = document.getElementById('btnSub');
const triggerUnPush = document.getElementById('btnUnsub');

const currentUserId = "myAvatarId1";

async function triggerPushNotification() {
  if ('serviceWorker' in navigator) {
    const beamsClient = new PusherPushNotifications.Client({
      instanceId: 'ed6e47de-ab49-489a-8982-eeec598b2b8b',
    });

    beamsClient
      .getUserId()
      .then((userId) => {
        // Check if the Beams user matches the user that is currently logged in
        if (userId !== currentUserId) {
          // Unregister for notifications
          return beamsClient.stop();
        }
      })
      .catch(console.error);

    const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
      url: "http://localhost:5000/pusher/beams-auth",
    });

    beamsClient.start()
      .then((beamsClient) => beamsClient.getDeviceId())
      .then((deviceId) =>
        console.log("Successfully registered with Beams. Device ID:", deviceId)
      )
      .then(() => beamsClient.setUserId(currentUserId, beamsTokenProvider))
      .catch(console.error);


  } else {
    console.error('Service workers are not supported in this browser');
  }
}

triggerPush.addEventListener('click', () => {
  triggerPushNotification().catch(error => console.error(error));
});

triggerUnPush.addEventListener('click', () => {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: 'ed6e47de-ab49-489a-8982-eeec598b2b8b',
  });
  beamsClient
    .getUserId()
    .then((userId) => {
      // Unregister for notifications
      return beamsClient.stop();
    })
    .catch(console.error);
});

let worker = new Worker("fetch-worker.js");

//handling onmessage event which send from worker tread
worker.addEventListener(
  "message",
  (e) => {
    console.log("UI:"+e.data);
  },
  false
);

//Start QueryTxnID
worker.postMessage({
  requestQueryUrl: {
    url: "http://localhost:5000/queryTxnId",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "id":"1661445102302",
      "jsonrpc":"2.0",
      "result":{
         "txnEncodeData":"0200000001d6ae071ac67527ec26e3ef7320205ad11f3fc7f1ecd38c8ed7b01402653ef70b000000006a47304402202d9896c41addca73ac3917a213792dec6315b99e631271c2cacdd0355be08d4502200397c4a1f3d415af23a0ee9204571e4865f2dc728e81b3b32682134ed58d82a70121021e3814727b62bb0a3be4ec4faa17fb87504bd3922bffbc8db0c81c5496d467b3ffffffff0200e1f505000000001976a914d57571ee8f1d9bfc741b10e2dfd38bbe6f712cee88ac7c9f8042170000001976a91458d70e440419c1f564f24232f924cf93dc93cfc688ac00000000",
         "txnId":"6659b67d661d19a927dd73ed7fbc5371ae782190501b9eb6c4b9cd4b154859bf"
      }
    },
  },
  requestGenerateSignatureUrl: {
    url: "http://localhost:5000/generateSignatureTxnId",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      "privateId":"12ij3i23",
      "masqueId":"LazyDuck",
      "result":{
       "message":"xxxxxxxxxxx",
       "signature":"16b15f88bbd2e0a22d1d0084b8b7080f2003ea83eab1a00f80d8c18446c9c1b6224f17aa09eaf167717ca4f355bb6dc94356e037edf3adf6735a86fc3741f5231b"
    }
  }
},

  requestSubmitValidatedTxnUrl: {
  url: "http://localhost:5000/SubmitvalidateTxnId",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    "id":"1661445102302",
    "jsonrpc":"2.0",
    "result":{
       "txnEncodeData":"16b15f88bbd2e0a22d1d0084b8b7080f2003ea83eab1a00f80d8c18446c9c1b6224f17aa09eaf167717ca4f355bb6dc94356e037edf3adf6735a86fc3741f5231b",
       "txnId":"6659b67d661d19a927dd73ed7fbc5371ae782190501b9eb6c4b9cd4b154859bf"
    }
}
}
});