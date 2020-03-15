const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ body }) => {
    const params = JSON.parse(body);

    const device = {
        id: params.id,
        account_id: params.accountId,
        pet_id: params.petId
    };

    await documentClient.put({
       TableName: 'devices',
       Item: {
           ...device
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
