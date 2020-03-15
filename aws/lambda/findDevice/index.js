const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ queryStringParameters }) => {
    const accountId = queryStringParameters.id.toLowerCase();

    const device = (await documentClient.query({
        TableName: 'devices',
        IndexName: 'account_id-index',
        KeyConditionExpression: '#aid = :aid',
        ExpressionAttributeNames: {
            '#aid': 'account_id'
        },
        ExpressionAttributeValues: {
            ':aid': accountId
        }
    }).promise()).Items;

    const hasFoundDevice = device.length === 1;

    if (hasFoundDevice) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(device[0])
        }
    }

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 404
    };
};
