var awsIot = require('aws-iot-device-sdk');
//

// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT.
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
var device = awsIot.device({
    keyPath: './certificates/otgw-iot-private.key',
    certPath: './certificates/otgw-iot.crt',
    caPath: './certificates/root-ca.crt',
    clientId: 'otgw-bridge',
    host: '',
    debug: true
});



var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.178.9');

device
    .on('connect', function() {

    });
device
    .on('close', function(err) {
        console.log('close', err);
    });
device
    .on('reconnect', function() {
        console.log('reconnect');
    });
device
    .on('offline', function() {
        console.log('offline');
    });
device
    .on('error', function(error) {
        console.log('error', error);
    });
device
    .on('message', function(topic, payload) {
        console.log('message', topic, payload.toString());
        if (topic === 'change-temperature-setpoint') {
            console.log('temperature setpoint change received');
            client.publish('actions/otmonitor/setpoint', )
        }

    });

device.subscribe('change-temperature-setpoint', function(err) {
    if (err) {
        console.log('subscription failed');
    }
});

client.on('connect', function () {
    client.subscribe('events/central_heating/otmonitor/roomtemperature', function (err) {
        if (err) {
            console.log('error subscribing.', err);
        }
    });

});

client.on('message', function (topic, message) {
    // message is Buffer
    var messageAsJson = JSON.parse(message.toString());
    console.log(typeof message, messageAsJson);
    messageAsJson.temperature = messageAsJson.value;
    delete messageAsJson.value;

    console.log(JSON.stringify(messageAsJson));
    // client.end()
    device.publish('otgw/roomtemperature', JSON.stringify(messageAsJson), null, function(response) {
        console.log('message sent succesfully');
    })
});