const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ body }) => {
    const params = JSON.parse(body);

    const account = {
        id: params.emailAddress.toLowerCase(),
        email_address: params.emailAddress,
        password: params.password
    };

    await documentClient.put({
       TableName: 'accounts',
       Item: {
           ...account
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
