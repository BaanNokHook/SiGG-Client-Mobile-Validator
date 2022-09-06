import { request as _request } from 'https';
import HttpsProxyAgent from 'https-proxy-agent';
// eslint-disable-next-line no-undef
import { operation as _operation } from 'retry';
// eslint-disable-next-line no-undef
import { credential as _credential, initializeApp } from "firebase-admin";
// eslint-disable-next-line no-undef
import TopicRequest from '../lib/topic_request';
// eslint-disable-next-line no-undef
import TopicOptions from '../lib/topic_options';
// eslint-disable-next-line no-undef
import TopicData from '../lib/topic_data';


function FCM(accountKey, proxy_url=null, name=null) {
    let admin = null
    if(!proxy_url) {
        // eslint-disable-next-line no-undef
        proxy_url = process.env.http_proxy || null;
    }
    if(!accountKey) {
        throw Error('You must provide the APIKEY for your firebase application.');
    }
    else if(typeof accountKey == 'string') { //API KEY PASSED string, legacy use

        this.serverKey = accountKey;

        this.fcmOptions = {
            host: 'fcm.googleapis.com',
            port: 443,
            path: '/fcm/send',
            method: 'POST',
            headers: {}
        };

        this.send = function (payload, CB) {

            let self = this;
            if (!CB) {
                throw Error('you must provide a callback function(err,result)'); //just in case
            }
            else {
                let operation = _operation();
                let mpayload = JSON.stringify(payload);
                let mFcmOptions = Object.assign({}, self.fcmOptions); //copying the fcmOptions object to avoid problems in parallel calls

                if(proxy_url) {
                    // HTTP/HTTPS proxy to connect to
                    let proxy = proxy_url;
                    let agent = new HttpsProxyAgent(proxy);

                    mFcmOptions.agent = agent;
                }

                operation.attempt(function (currentAttempt) {
                    let headers = {
                        'Host': mFcmOptions.host,
                        'Authorization': 'key=' + self.serverKey,
                        'Content-Type': 'application/json'
                        //'Content-Length': mpayload.length //removed this line for chunk-encoded transfer compatibility (UTF-8 and all non-ANSI codification)
                    };

                    mFcmOptions.headers = headers;

                    if (self.keepAlive) headers.Connection = 'keep-alive';

                    let request = _request(mFcmOptions, function (res) {
                        let data = '';


                        if (res.statusCode == 503) {
                            // If the server is temporary unavailable, the FCM spec requires that we implement exponential backoff
                            // and respect any Retry-After header
                            if (res.headers['retry-after']) {
                                let retrySeconds = res.headers['retry-after'] * 1; // force number
                                if (isNaN(retrySeconds)) {
                                    // The Retry-After header is a HTTP-date, try to parse it
                                    retrySeconds = new Date(res.headers['retry-after']).getTime() - new Date().getTime();
                                }
                                if (!isNaN(retrySeconds) && retrySeconds > 0) {
                                    operation._timeouts['minTimeout'] = retrySeconds;
                                }
                            }
                            if (!operation.retry('TemporaryUnavailable')) {
                                CB(operation.mainError(), null);
                            }
                            // Ignore all subsequent events for this request
                            return;
                        }

                        function respond() {
                            let error = null, id = null;

                            //Handle the various responses
                            if (data.indexOf('\"multicast_id\":') > -1)//multicast_id success
                            {
                                let anyFail = ((JSON.parse(data)).failure > 0);

                                if (anyFail) {
                                    error = data.substring(0).trim();
                                }

                                let anySuccess = ((JSON.parse(data)).success > 0);

                                if (anySuccess) {
                                    id = data.substring(0).trim();
                                }
                            } else if (data.indexOf('\"message_id\":') > -1) {  //topic messages success
                                id = data;
                            } else if (data.indexOf('\"error\":') > -1) { //topic messages error
                                error = data;
                            } else if (data.indexOf('TopicsMessageRateExceeded') > -1) {
                                error = 'TopicsMessageRateExceededError'
                            } else if (data.indexOf('Unauthorized') > -1) {
                                error = 'NotAuthorizedError'
                            } else {
                                error = 'InvalidServerResponse';
                            }
                            // Only retry if error is QuotaExceeded or DeviceQuotaExceeded
                            if (operation.retry(currentAttempt <= 3 && ['QuotaExceeded', 'DeviceQuotaExceeded', 'InvalidServerResponse'].indexOf(error) >= 0 ? error : null)) {
                                return;
                            }
                            // Success, return message id (without id=)
                            CB(error, id);
                        }

                        res.on('data', function (chunk) {
                            data += chunk;
                        });
                        res.on('end', respond);
                    });

                    request.on('error', function (error) {
                        CB(error, null);
                    });

                    request.end(mpayload);
                });
            }
        }

        // Subscribe devices to topic
        // If topic does not exist, a new one is created
        this.subscribeToTopic = (deviceTokens, topicName, CB) => {

            const options = TopicOptions('iid.googleapis.com', '/iid/v1:batchAdd', 'POST', this.serverKey.slice(0));
            const subscriptionData = TopicData(topicName, deviceTokens);

            TopicRequest(options, subscriptionData, (err, res) => {
                CB(err, res);
            });
        }

        // Unsubscribe device to topic
        this.unsubscribeToTopic = (deviceTokens, topicName, CB) => {
            const options = TopicOptions('iid.googleapis.com', '/iid/v1:batchRemove', 'POST', this.serverKey.slice(0));
            const unsubscriptionData = TopicData(topicName, deviceTokens);

            TopicRequest(options, unsubscriptionData, (err, res) => {
                CB(err, res);
            });
        }
    }
    else{ //accountkey object passed, new SDK 'de-promisefy' use
        const config = 'private_key' in accountKey || 'privateKey' in accountKey ?
            {credential: _credential.cert(accountKey)} :
            accountKey;

        if(name) {
            admin = initializeApp(config, name);
        } else {
            admin = initializeApp(config);
        }
        this.send = function(payload, _callback){
            if (!_callback) {
                throw Error('You must provide a callback function(err,result)')
            }
            else{
                if(!payload) _callback(new Error('You must provide a payload object'))
                else{
                    if(payload.to) {
                        if (typeof payload.to == 'string') {
                            let to = payload.to
                            delete payload.to
                            if (to.startsWith('/topics/')) {
                                let topic = to.slice(8)//anything after '/topics/'

                                admin.messaging().sendToTopic(topic, payload)
                                    .then(function(response){_callback(null, response)})
                                    .catch(function (err) {_callback(err)})
                            }
                            else{
                                admin.messaging().sendToDevice(to,payload)
                                    .then(function (response) {_callback(null,response)})
                                    .catch(function (error) {_callback(error)})
                            }
                        }
                        else{
                            let err = new Error('Invalid "to" field in payload');
                            _callback(err)
                        }
                    }
                    else if(payload.registration_ids){
                        let regIds = payload.registration_ids;
                        delete payload.registration_ids;
                        if(regIds instanceof Array && typeof regIds[0] == 'string')
                        {
                            admin.messaging().sendToDevice(regIds, payload)
                                .then(function (response) {_callback(null,response)})
                                .catch(function (error) {_callback(error)})
                        }
                        else{
                            let err = new Error('Invalid "registration_ids" field in payload');
                            _callback(err)
                        }
                    }
                    else{
                        let err = new Error('Invalid payload object');
                        _callback(err)
                    }
                }
            }
        }
    }
}

// eslint-disable-next-line no-undef
export default FCM;
