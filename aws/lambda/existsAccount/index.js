const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ queryStringParameters }) => {
    const query = queryStringParameters.q.toLowerCase();

    const account = (await documentClient.query({
        TableName: 'accounts',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': query
        }
    }).promise()).Items;

    const hasFoundAccount = account.length === 1;

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: (hasFoundAccount) ? 200 : 404
    };
};
