module.exports = {
	name: 'threadCreate',
	description: 'Regelt threadCreate event',
	async execute(client, thread) {
		if (thread.joinable)
			thread.join();
	}
}