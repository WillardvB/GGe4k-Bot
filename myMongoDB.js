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
            await client.connect();
            await RefreshData();
            await client.close();
            finishedGettingData = true;
        }
        catch (e) {
            await client.close();
            Logger.logError(e);
            this.execute(client);
        }
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
                let _i_i = -1;
                await client.connect();
                let dbName = collection.split('_')[0];
                let collName = collection.split('_')[1];
                let idCompare = "id";
                let oldData;
                if (collection === DATA.E4K.PLAYERS) {
                    oldData = playerData;
                    idCompare = "playerId";
                    _i_i = Math.floor(Math.random() * newData.length);
                }
                else if (collection === DATA.E4K.ALLIANCES) {
                    oldData = allianceData;
                    idCompare = "allianceId";
                }
                else if (collection === DATA.DC.USERS)
                    oldData = dcUserData;
                else if (collection === DATA.DC.CHANNELS)
                    oldData = channelData;
                let dataToInsert = [];
                let dataToUpdate = [];
                if (finishedGettingData) {
                    for (let i = 0; i < newData.length; i++) {
                        let foundData = false;
                        for (let j = 0; j < oldData.length; j++) {
                            if (oldData[j][idCompare] === newData[i][idCompare]) {
                                console.log("hetzelfde?: " + oldData[j] === newData[i]);
                                if (_i_i === i) {
                                    console.log("OldData!");
                                    console.log(oldData[j]);
                                    console.log("NewData!");
                                    console.log(newData[i]);
                                    console.log("hetzelfde??");
                                    console.log(CompareJSON(oldData[j], newData[i]));
                                }
                                foundData = true;
                                if (oldData[j] !== newData[i]) {//!CompareJSON(oldData[j], newData[i])) {
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
                if (idCompare === "playerId") {
                    console.log("dataToInsert: " + dataToInsert.length + ", dataToUpdate: " + dataToUpdate.length);
                }
                if (dataToInsert.length !== 0) {
                    await insertMany(dataToInsert, dbName, collName);
                }
                if (dataToUpdate.length !== 0) {
                    await updateMany(dataToUpdate, dbName, collName, idCompare);
                }
                await client.close();
                await client.connect();
                if (dataToUpdate.length !== 0 || dataToInsert.length !== 0) {
                    await RefreshData();
                    finishedGettingData = true;
                }
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
            const datajs = require('./e4kserver/data.js');
            await GetData(DATA.E4K.ALLIANCES);
            for (let i = 0; i < allianceData.length; i++) {
                let _alliance = allianceData[i];
                datajs.alliances[_alliance.allianceId] = _alliance;
            }
            await GetData(DATA.E4K.PLAYERS);
            for (let i = 0; i < playerData.length; i++) {
                let _player = playerData[i];
                datajs.players[_player.playerId] = _player;
            }
            await GetData(DATA.DC.USERS);
            await GetData(DATA.DC.CHANNELS);
            resolve("finished");
        }
        catch (e) {
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
    return new Promise(async (resolve, reject) => {
        try {
            let dbName = db_collection.split('_')[0];
            let collectionName = db_collection.split('_')[1];
            /** @type Collection */
            const collection = client.db(dbName).collection(collectionName);
            if (collection !== null && collection.dbName === dbName) {
                let result = await collection.find({}).toArray();
                let output = [];
                for (let i = 0; i < result.length; i++) {
                    let data = result[i];
                    delete data['_id'];
                    output.push(data);
                }
                if (dbName + '_' + collectionName === DATA.E4K.PLAYERS)
                    playerData = output;
                if (dbName + '_' + collectionName === DATA.E4K.ALLIANCES)
                    allianceData = output;
                if (dbName + '_' + collectionName === DATA.DC.USERS)
                    dcUserData = output;
                if (dbName + '_' + collectionName === DATA.DC.CHANNELS)
                    channelData = output;
                return resolve(output);
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
    return new Promise(async (resolve, reject) => {
        try {
            /** @type Collection */
            const collection = client.db(dbName).collection(collectionName);
            if (collection !== null && collection.dbName === dbName) {
                let res = await collection.insertMany(obj);
                console.log("Number of documents inserted: " + res.insertedCount);
                return resolve(res);
            }
            else {
                return reject("Collection not found in database");
            }
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
            /** @type Collection */
            const collection = client.db(dbName).collection(collectionName);
            if (collection !== null && collection.dbName === dbName) {
                let modifiedCount = 0;
                for (let i = 0; i < obj.length; i++) {
                    let filter = {};
                    filter[idCompare] = obj[i][idCompare];
                    let updateDoc = { $set: obj[i], };
                    let result = await collection.updateOne(filter, updateDoc);
                    modifiedCount += result.modifiedCount;
                }
                if (modifiedCount !== 0) {
                    console.log("Number of documents updated: " + modifiedCount);
                }
                return resolve("Number of documents updated: " + modifiedCount);
            }
            else {
                return reject("Collection not found in database");
            }
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
    const keys2 = Object.keys(json2);
    for (let i = 0; i < keys2.length; i++) {
        let key = keys2[i];
        if (json1[key] !== json2[key]) {// && (typeof json1[key] !== "object" || typeof json2[key] !== "object")) { //values are not the same
            return false;
        }
        else if (typeof json1[key] === "object" || typeof json2[key] === "object") {
            if (json1[key] === null && json2[key] === null) { }
            else if (json1[key] === null || json2[key] === null || typeof json1[key] !== typeof json2[key]) {
                return false;
            }
            else if (!CompareJSON(json1[key], json2[key])) {
                return false;
            }
        }
    }
    return true;
}