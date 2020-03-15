const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.getConnection = async (id) => (
    documentClient.query({
        TableName: 'connections',
        IndexName: 'device_id-index',
        KeyConditionExpression: '#did = :did',
        ExpressionAttributeNames: {
            '#did': 'device_id'
        },
        ExpressionAttributeValues: {
            ':did': id
        }
    }).promise()
);

module.exports.deleteConnection = async (id) => {
    console.log('Deleting connection id: ', id);

    return documentClient.delete({
        TableName: 'connections',
        Key: {
            id
        }
    }).promise();
}
