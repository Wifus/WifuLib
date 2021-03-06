import { Discord, Client, p } from "../Types.ts"
import CommandSyntaxError from "../Errors/CommandSyntaxError.ts"
import Reply from "../Builders/Reply.ts"
import InteractionResponse from "../Objects/InteractionResponse.ts"

class CommandHandler {

    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    async executeCheck(interaction: Discord.GatewayInteractionCreateDispatchData) {
        const { data: { id: commandId }, member: { user: { id } } } = interaction;
        const command = this.#client.commands.get(commandId);
        // const user = this.#client.users.get(id);

        //Check if command exists
        if (!command) return;

        const params = getParams(this.#client, interaction);

        //Cooldown check
        // if(this.#client.interactionManager.onCooldown(command, user, params)) return;

        try {
            await command.execute(params);
        } catch (error) {
            if(error instanceof CommandSyntaxError){
                await this.#client.createInteractionResponse(interaction, new Reply(error.toString()).ephemeral());
            }
        }
    }

}

//Manage the DM/GUILD interactions, eventually...
function getParams(client: Client, interaction: Discord.GatewayInteractionCreateDispatchData): p {
    const { guild_id: guildId, channel_id: channelId, member: { user: { id } } } = interaction;
    
    const guild = client.guilds.get(guildId);
    const { members } = guild;

    return {
        client: client,
        data: interaction.data,
        guild: guild,
        member: members.get(id),
        reply: async (reply: Reply): Promise<InteractionResponse> => {
			return await client.createInteractionResponse(interaction, reply);
		},
		send: async (message: Discord.RESTPostAPIChannelMessageJSONBody) => {
            await client.createInteractionResponse(interaction, new Reply());
			return await client.createMessage(channelId, message);
		},
    }
}

export default CommandHandler