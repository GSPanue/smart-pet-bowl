const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.setConnection = async (id, deviceId) => {
    return documentClient.put({
        TableName: 'connections',
        Item: {
            id,
            device_id: deviceId
        }
    }).promise();
}

module.exports.deleteConnection = async (id) => {
    console.log('Deleting connection id: ', id);

    return documentClient.delete({
        TableName: 'connections',
        Key: {
            id
        }
    }).promise();
}
