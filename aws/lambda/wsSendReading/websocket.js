const AWS = require('aws-sdk');
const database = require('./database');

require('aws-sdk/clients/apigatewaymanagementapi');

module.exports.sendMessage = async (id, endpoint, message) => {
    const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint
    });

    try {
        await apiGatewayManagementApi.postToConnection({
            ConnectionId: id,
            Data: JSON.stringify({
                action: 'sendReading',
                ...message
            })
        }).promise();
    }
    catch (error) {
        if (error.errorCode === 410) {
            database.deleteConnection(id)
        }
    }
};
