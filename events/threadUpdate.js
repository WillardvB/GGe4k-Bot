module.exports = {
	name: 'threadUpdate',
	description: 'Regelt threadUpdate event',
	async execute(client, oldThread, newThread) {
		if (newThread.archived)
			newThread.setArchived(false);
	}
}