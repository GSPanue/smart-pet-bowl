const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ body }) => {
    const params = JSON.parse(body);

    const reading = {
        id: params.id,
        device_id: params.deviceId,
        timestamp: params.timestamp,
        weight: params.weight
    };

    await documentClient.put({
       TableName: 'readings',
       Item: {
           ...reading
       }
    }).promise();

    return {
        headers: {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200
    };
};
