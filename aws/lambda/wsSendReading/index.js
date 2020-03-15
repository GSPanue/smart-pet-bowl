const AWS = require('aws-sdk');
const database = require('./database');
const websocket = require('./websocket');

const endpoint = '6n5tgt5ig1.execute-api.us-east-1.amazonaws.com/dev';

exports.handler = async (event) => {
    const records = event.Records;

    const readingsData = records.map(({ dynamodb: { NewImage } }) => (
        AWS.DynamoDB.Converter.unmarshall(NewImage)
    ));

    const hasReadings = Object.keys(readingsData[0]).length > 0;

    if (hasReadings) {
        const mergedReadingsData = {};

        readingsData.map(({ device_id, timestamp, weight }) => {
            if (!mergedReadingsData[device_id]) {
                mergedReadingsData[device_id] = {
                    data: []
                }
            }

            mergedReadingsData[device_id].data.push({
                timestamp,
                weight
            });
        });

        const newReadingsData = [];

        await Promise.all(Object.keys(mergedReadingsData).map(async (deviceId) => {
            const connection = (await database.getConnection(deviceId)).Items;
            const isConnected = connection.length > 0;

            if (isConnected) {
                newReadingsData.push({
                    connectionId: connection[0].id,
                    data: [...mergedReadingsData[deviceId].data]
                })
            }
        }));

        await Promise.all(newReadingsData.map(async ({ connectionId, data }) => {
            return websocket.sendMessage(connectionId, endpoint, {
                message: data
            });
        }));
    }

    return {
        statusCode: 200
    };
};
