const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ body }) => {
    const params = JSON.parse(body);

    const accountId = params.emailAddress.toLowerCase();

    const account = (await documentClient.query({
        TableName: 'accounts',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': accountId
        }
    }).promise()).Items;

    const hasFoundAccount = account.length === 1;

    if (hasFoundAccount) {
        const hasMatchingPassword = account[0].password === params.password;

        if (hasMatchingPassword) {
            return {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                statusCode: 200,
                body: JSON.stringify({
                    account: {
                        ...account[0]
                    }
                })
            };
        }
    }

    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 401
    };
};
