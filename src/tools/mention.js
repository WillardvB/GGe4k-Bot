module.exports = {
	getUser: function (client, mention) {
		return getUserFromMention(client, mention);
	}
};

function getUserFromMention(client, mention) {
	const matches = mention.match(/^<@!?(\d+)>$/);
	if (!matches) return null;
	const id = matches[1];
	return client.users.cache.get(id);
}