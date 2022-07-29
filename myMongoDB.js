const { MongoClient, Collection } = require('mongodb');
const Logger = require('./tools/Logger');

/** @type MongoClient */
let client = null;

let playerData = [];
let allianceData = [];
let dcUserData = [];
let channelData = [];

let finishedGettingData;

const DATA = {
    E4K: {
        PLAYERS: 'E4K_Players',
        ALLIANCES: 'E4K_Alliances',
    },
    DC: {
        USERS: 'Discord_Users',
        CHANNELS: 'Discord_Channels',
    }
}

module.exports = {
    Collection: DATA,
    /**
     * 
     * @param {MongoClient} mongoClient
     */
    async execute(mongoClient) {
        client = mongoClient;
        try {
            await RefreshData();
        }
        catch (e) {
            Logger.logError(e);
        }
        finishedGettingData = true;
    },
    /**
     * @returns {Promise} promise
     * @param {Array} newData
     * @param {string} collection
     */
    async compareData(newData, collection) {
        if (client === null) return;
        return new Promise(async (resolve, reject) => {
            try {
                await client.connect();
                let dbName = collection.split('_')[0];
                let collName = collection.split('_')[1];
                let idCompare = "id";
                let oldData;
                if (collection == DATA.E4K.PLAYERS) {
                    oldData = playerData;
                    idCompare = "playerId";
                }
                else if (collection == DATA.E4K.ALLIANCES) {
                    oldData = allianceData;
                    idCompare = "allianceId";
                }
                else if (collection == DATA.DC.USERS)
                    oldData = dcUserData;
                else if (collection == DATA.DC.CHANNELS)
                    oldData = channelData;
                let dataToInsert = [];
                let dataToUpdate = [];
                if (finishedGettingData) {
                    for (let i = 0; i < newData.length; i++) {
                        let foundData = false;
                        for (let j = 0; j < oldData.length; j++) {
                            if (oldData[j][idCompare] == newData[i][idCompare]) {
                                foundData = true;
                                if (!CompareJSON(oldData[j], newData[i])) {
                                    dataToUpdate.push(newData[i]);
                                }
                                break;
                            }
                        }
                        if (!foundData) {
                            dataToInsert.push(newData[i]);
                        }
                    }
                }
                console.log("dataToInsert");
                console.log(dataToInsert.slice(0, 3));
                console.log("dataToUpdate");
                console.log(dataToUpdate.slice(0, 3));
                if (dataToInsert.length != 0) {
                    await insertMany(dataToInsert, dbName, collName);
                }
                if (dataToUpdate.length != 0) {
                    await updateMany(dataToUpdate, dbName, collName, idCompare);
                }
                if (dataToUpdate.length != 0 || dataToInsert.length != 0) {
                    await RefreshData();
                }
                finishedGettingData = true;
                await client.close();
                return resolve("finished database");
            }
            catch (err) {
                finishedGettingData = true;
                await client.close();
                return reject(err);
            }
        })
    }
}

async function RefreshData() {
    return new Promise(async (resolve, reject) => {
        try {
            finishedGettingData = false;
            await client.connect();
            await GetData(DATA.E4K.ALLIANCES);
            await GetData(DATA.E4K.PLAYERS);
            //await GetData(DATA.DC.USERS);
            //await GetData(DATA.DC.CHANNELS);
            await client.close();
            resolve("finished");
        }
        catch (e) {
            await client.close();
            Logger.logError(`Error getting data: ${e}`);
            reject(e);
        }
    })
}

/**
 * @returns {Promise}
 * @param {string} dbName
 * @param {string} collectionName
 */
function GetData(db_collection) {
    return new Promise((resolve, reject) => {
        try {
            let dbName = db_collection.split('_')[0];
            let collectionName = db_collection.split('_')[1];
            /** @type Collection */
            const collection = client.db(dbName).collection(collectionName);
            if (collection != null && collection.dbName == dbName) {
                collection.find({}).toArray(function (err, result) {
                    if (err) throw err;
                    let output = [];
                    for (let i = 0; i < result.length; i++) {
                        let data = result[i];
                        delete data['_id'];
                        output.push(data);
                    }
                    if (dbName + '_' + collectionName == DATA.E4K.PLAYERS)
                        playerData = output;
                    if (dbName + '_' + collectionName == DATA.E4K.ALLIANCES)
                        allianceData = output;
                    if (dbName + '_' + collectionName == DATA.DC.USERS)
                        dcUserData = output;
                    if (dbName + '_' + collectionName == DATA.DC.CHANNELS)
                        channelData = output;
                    return resolve(output);
                });
            }
            else {
                return reject("Collection not found in database");
            }
        }
        catch (err) {
            return reject(err);
        }
    });
}

/**
 * 
 * @param {Array} obj
 * @param {string} dbName
 * @param {string} collectionName
 */
function insertMany(obj, dbName, collectionName) {
    return new Promise((resolve, reject) => {
        try {
            client.connect(err => {
                if (err) console.log(err);
                /** @type Collection */
                const collection = client.db(dbName).collection(collectionName);
                if (collection != null && collection.dbName == dbName) {
                    collection.insertMany(obj, function (err, res) {
                        if (err) throw err;
                        console.log("Number of documents inserted: " + res.insertedCount);
                        client.close();
                        return resolve(res);
                    });
                }
                else {
                    client.close();
                    return reject("Collection not found in database");
                }
            });
        }
        catch (e) {
            return reject(e);
        }
    })
}

/**
 * 
 * @param {Array} obj
 * @param {string} dbName
 * @param {string} collectionName
 */
function updateMany(obj, dbName, collectionName, idCompare) {
    return new Promise(async (resolve, reject) => {
        try {
            client.connect(async (err) => {
                if (err)
                    console.log(err);
                /** @type Collection */
                const collection = client.db(dbName).collection(collectionName);
                if (collection != null && collection.dbName == dbName) {
                    let modifiedCount = 0;
                    for (let i = 0; i < obj.length; i++) {
                        let filter = { };
                        filter[idCompare] = obj[i][idCompare];
                        let updateDoc = { $set: obj[i], };
                        let result = await collection.updateOne(filter, updateDoc);
                        if (result.modifiedCount == 0) {
                            console.log(result);
                        }
                        modifiedCount += result.modifiedCount;
                    }
                    console.log("Number of documents updated: " + modifiedCount);
                    client.close();
                    return resolve("Number of documents updated: " + modifiedCount);
                }
                else {
                    client.close();
                    return reject("Collection not found in database");
                }
            });
        }
        catch (e) {
            return reject(e);
        }
    })
}

/**
 * @returns {Boolean} isEqual
 * @param {any} json1
 * @param {any} json2
 * @description Returns true if the json keys and values are the same, otherwise false
 */
function CompareJSON(json1, json2) {
    let differences = [];
    const keys2 = Object.keys(json2);
    for (let i = 0; i < keys2.length; i++) {
        let key = keys2[i];

        if (json1[key] != json2[key] && (typeof json1[key] !== "object" || typeof json2[key] !== "object")) { //values are not the same
            differences.push(key);
        }
        else if (typeof json1[key] === "object" || typeof json2[key] === "object") {
            if (json1[key] == null && json2[key] == null) { }
            else if (json1[key] == null || json2[key] == null || typeof json1[key] !== typeof json2[key]) {
                differences.push(key);
            }
            else if (!CompareJSON(json1[key], json2[key])) {
                differences.push(key);
            }
        }
    }
    if (differences.length >= 1) {
        let text = json1.name + " heeft de volgende veranderingen: ";
        for (let i = 0; i < differences.length; i++) {
            if (typeof json2[differences[i]] !== "object") {
                text = text + '\n' + differences[i] + ": van " + json1[differences[i]] + " naar " + json2[differences[i]];
            }
        }
        if (text != json1.name + " heeft de volgende veranderingen: ")
            console.log(text);
        return false;
    }
    else
        return true;
}