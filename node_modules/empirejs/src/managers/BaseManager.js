const {Client} = require('./../Client');
const {EventEmitter} = require('node:events');

/**
 * 
 * @extends {EventEmitter}
 */
class BaseManager extends EventEmitter{
    /**
     * 
     * @param {Client} client 
     */
    constructor(client){
        super();
        this._client = client;
    }
}

module.exports = BaseManager;