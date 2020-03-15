const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async ({ queryStringParameters }) => {
    const id = queryStringParameters.id;

    const pet = (await documentClient.query({
        TableName: 'pets',
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': id
        }
    }).promise()).Items;

    const hasFoundPet = pet.length === 1;

    if (hasFoundPet) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            statusCode: 200,
            body: JSON.stringify(pet[0])
        }
    }

    return {
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 404
    };
};
