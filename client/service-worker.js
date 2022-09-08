
importScripts("https://js.pusher.com/beams/service-worker.js");

// //#Overriding default SDK behavior

PusherPushNotifications.onNotificationReceived = ({ pushEvent, payload }) => {

  console.log(JSON.stringify(payload)); 

  pushEvent.waitUntil(handleTxnNotification(payload));

};


//Must providing by Client

let queryUrl="http://localhost:5000/queryTxnId", generateSignatureUrl="http://localhost:5000/generateSignatureTxnId", submitValidatedTxnUrl="http://localhost:5000/SubmitvalidateTxnId"; //TODO: make a sending these variables by client UIThread -> Service Worker Thread
let userId="xxxxxx", masqueId="LazyDuck", encryptedMnemonicPhrased="{\"data\": \"PE1C05/DTSzikUtS9fn3nh2+m/MuD7lzWHPtbsc4bYstwuZRbewEITQ5dsAXr3PkAYtCQbHekJRcV6VO3G6CMLvrPZvb66HvpOEUToGKHjugTc2D92Kgw4IvOy1t\",\"iv\": \"Wh86E08FCx7ahZM4ePiqlw==\",\"salt\": \"P2FhZBPjH3+2IOl5BxaF9VFsemSuFr2ph1GVnWRuP0Q=\"}"; // User Account //TODO: retrieve values from Caller. How to?

// Handle Transaction Notification //  

let handleTxnNotification =  (async (payload) => {

    let txnId  = payload.notification.body;
    let txnEncodeData;                
    let signature;

    //1. Query Transaction Data by Transaction ID
    
    let queryTxnIdResp = await fetch(queryUrl, {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'   
      },
      // body: JSON.stringify(user)
      body: JSON.stringify( {
        id: Date.now(),
        jsonrpc:"2.0",  
        method: "getunverifytx",
        params: [txnId]
      })
    });
   
   await queryTxnIdResp.json().then(data=>{
        
      txnEncodeData = data.result.txnEncodeData;
      console.log("1. Raw Txn Data :"+ txnEncodeData);
    });
 
   
    //2. Check Rules-based

    // TODO: Implement Rules-based ==> Omit for now
    // let  CheckRules = (args) => {
    //   return args['value'].length >= 5;
    // };
    // let options = {
    //   rules: {
    //       'user': { required: true },
    //       'password': { minLength: [CheckRules, 'Need atleast 5 letters'] }
    //   }
    // };
    // let (formObject) = new ej.inputs.FormValidator('#form-element', options);

    //3. Generate Signature
if (txnEncodeData != undefined) {
     await fetch(generateSignatureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      // body: JSON.stringify(user)
      body: JSON.stringify( {
        privateId: userId,
        encryptMnemonic: encryptedMnemonicPhrased,  
        masqueId: masqueId,
        message: txnEncodeData
      })
    })
    .then((response)=>response.json())
    .then((data)=>{
    console.log("JSON Resp:"+ data);
      signature = data.signature;
      console.log("Signature :"+ signature);
    });


    
  }
    //4. Submit validated transaction
if( signature) {
    let SubmitvalidateTxnId = await fetch(submitValidatedTxnUrl, {
      
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      // body: JSON.stringify(user)
      body: JSON.stringify( {
        id: Date.now(),
        jsonrpc:"2.0",  
        method: "sendvalidatedrawtransaction",
        params: [txnId]
      })
    });
    await SubmitvalidateTxnIdResp.json().then(data=>{
        
      txnEncodeData = data.result.txnEncodeData;
      console.log("1. Raw Txn Data :"+ txnEncodeData);
    });
  }
});
    


