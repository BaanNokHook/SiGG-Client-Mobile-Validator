require('dotenv').config({ path: 'variables.env' });
    
    const express = require('express');
    const webPush = require('web-push');
    const bodyParser = require('body-parser');
    const path = require('path');
    
    const app = express();
    
    app.use(bodyParser.json());
    
    app.use(express.static(path.join(__dirname, 'client')));
    
    const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
    const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
    
    webPush.setVapidDetails('mailto:bhanumaw@ais.co.th', publicVapidKey, privateVapidKey);
    
    app.post('/subscribe', (req, res) => {
      const subscription = req.body
      console.log("subscription req.body:"+ JSON.stringify(subscription));
    
      res.status(201).json({});
    
      const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
      });
    
      webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
    });
    
    app.set('port', process.env.PORT || 5000);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });