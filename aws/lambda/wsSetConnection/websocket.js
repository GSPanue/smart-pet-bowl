const AWS = require('aws-sdk');
const database = require('./database');

require('aws-sdk/clients/apigatewaymanagementapi');

module.exports.sendMessage = (id, endpoint, message) => {
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint
    });

    return apiGatewayManagementApi.postToConnection({
        ConnectionId: id,
        Data: JSON.stringify({
            action: 'setConnection',
            ...message
        })
    }).promise();
};
