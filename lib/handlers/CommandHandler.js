const Message = require("../structures/Message");

/**
 * Handles all incomming Interaction Create events
 * @prop {Client} client The Client
 */
class CommandHandler{
	constructor(client){
		this.client = client;
	}
	
	/**
	 * Checks if a command can be executed based on Interaction Create event 
	 * @param {Object} interaction Interaction Create event data
	 */
	async executeCheck(interaction){
		const {data : {id}, member: {user: {id: user_id}}} = interaction;
		const command = this.client.commands.get(id);
		const user = this.client.users.get(user_id);

		//Check if command exists
		if(!command) return;
		
		const params = getParams(this.client, interaction);
		
		//Cooldown check
		if(this.client.interactionManager.onCooldown(command, user, params)) return;
		
        await command.execute(params);
	}

}

function getParams(client, interaction){
	const {guild_id, channel_id, member: {user: {id}}} = interaction;
	
	const guild = client.guilds.get(guild_id);
	const {members, presences} = guild;

	return {
		client: client,
		interaction: interaction,
		guild: guild,
		member: members.get(id),
		presence: presences.get(id),
		reply: async (reply) => {
			return await client.createInteractionResponse(interaction, reply);
		},
		send: async (message) => {
			return await client.createMessage(channel_id, message).then((msg) => new Message(msg, client));
		},
		cooldown: async (message, timems) => {
			const msgData = await client.createMessage(channel_id, {
				"content": `${message}`
			});
			const msg = new Message(msgData, client);
			msg.delete(timems);
		}
	}
}

module.exports = CommandHandler;