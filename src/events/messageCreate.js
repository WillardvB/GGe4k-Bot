module.exports.name = 'messageCreate';
/**
 *
 * @param client
 * @param {Message} m
 * @returns {Promise<void>}
 */
module.exports.execute = async function (client, m) {
    if(m.content === "." && m.author.id !== '831926132008943627'){
        switch (m.channel.parentId){
            case '1161026425764184099':
                try {
                    await m.channel.send({content: '*'})
                }
                catch (e) {
                    console.log(e);
                }
                break;
            default: return;
        }
    }
}