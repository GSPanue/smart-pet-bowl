const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ body }) => {
    const params = JSON.parse(body);

    const pet = {
        id: params.id,
        name: params.name,
        species: params.species
    };

    await documentClient.put({
       TableName: 'pets',
       Item: {
           ...pet
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
