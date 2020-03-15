const AWS = require('aws-sdk');
const database = require('./database');
const websocket = require('./websocket');

exports.handler = async (event) => {
    const params = JSON.parse(event.body);
    const deviceId = params.message;
    const { connectionId, domainName, stage } = event.requestContext;

    await database.setConnection(connectionId, deviceId);

    const endpoint = `${domainName}/${stage}`;

    try {
        await websocket.sendMessage(connectionId, endpoint, {
            message: true
        });
    }
    catch (error) {
        if (error.errorCode === 410) {
            database.deleteConnection(connectionId);
        }
    }

    return {
        statusCode: 200
    };
};
