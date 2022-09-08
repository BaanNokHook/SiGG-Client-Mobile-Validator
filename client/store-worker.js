let worker = new Worker("store-worker.js");


//Start Registration

worker.postMessage({

  requestPubKey: {

    url: "",

    method: "POST",

    headers: {

      "Content-Type": "application/json",

    },

    body: {

      "privateId": "",

      "encryptMnemonic": "",

      "masqueId": "",

	"env": "dev"   // Call dev, test, production  

    },

  },

  requestRegister: {

    url: "http://localhost:5000/devices",

    method: "POST",

    headers: {

      "Content-Type": "application/json",

    },

    body: {

      "userId": "apple",

      "deviceId": "web-8771cefe-47ce-44af-8c9f-f7e0d9273295"

    },
},

})
