const {nlserver} = require('../data/kanalen.json');

const ownerDcId = '346015807496781825'

/**
 *
 * @return {Promise<void>}
 * @private
 */
module.exports.__init = async function (){
    /** @type {Guild} */
    const _server = require('../index').dcClient.guilds.cache.find(guild => guild.id === nlserver.id);
    const server = await _server.fetch();
    // noinspection JSValidateTypes
    /** @type {GuildMember} */
    module.exports.owner = await server.members.fetch(ownerDcId);
};