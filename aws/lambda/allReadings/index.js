const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ queryStringParameters }) => {
    const deviceId = queryStringParameters.id;

    const readings = (await documentClient.query({
        TableName: 'readings',
        IndexName: 'device_id-index',
        KeyConditionExpression: '#did = :did',
        ExpressionAttributeNames: {
            '#did': 'device_id'
        },
        ExpressionAttributeValues: {
            ':did': deviceId
        }
    }).promise()).Items;

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
        body: JSON.stringify(readings)
    };
};
