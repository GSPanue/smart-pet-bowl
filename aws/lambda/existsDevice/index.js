const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ queryStringParameters }) => {
    const query = queryStringParameters.q;

    const device = (await documentClient.query({
        TableName: 'devices',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': query
        }
    }).promise()).Items;

    const hasFoundDevice = device.length === 1;

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: (hasFoundDevice) ? 200 : 404
    };
};
