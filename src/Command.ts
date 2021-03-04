import type { Client } from "./Client.ts";
import { Discord } from "../deps.ts";
import { p } from "./Types.ts";

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

        await command.execute(params);
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
        member: members.get(id)
    }
}

export { CommandHandler }