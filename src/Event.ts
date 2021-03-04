import type { Client } from "./Client.ts";
import { Discord } from "../deps.ts";
import { Guild, User, Role } from "./Objects.ts";

class EventHandler {

    #client: Client;

    constructor(client: Client) {
        this.#client = client;
    }

    handleDispatch(payload: Discord.GatewayDispatchPayload) {
        const { t, d } = payload;
        const { GatewayDispatchEvents } = Discord;
        this.#client.emit(`debug`, `${t}`);

        switch (t) {
            case GatewayDispatchEvents.Ready: {
                const data = <Discord.GatewayReadyDispatchData>d;
                this.#client.botUser = new User(data.user);
                const [id] = data.shard!;
                this.#client.shard(id).sessionId = data.session_id;
                break;
            }
            case GatewayDispatchEvents.GuildCreate: {
                const data = <Discord.GatewayGuildCreateDispatchData>d;
                this.#client.guilds.add(new Guild(data));
                for (const member of data.members!) {
                    this.#client.users.update(new User(member.user!));
                }
                for (const presence of data.presences!) {
                    this.#client.user(presence.user.id).update(presence);
                }
                break;
            }
            case GatewayDispatchEvents.GuildUpdate: {
                const data = <Discord.GatewayGuildUpdateDispatchData>d;
                this.#client.guilds.update(new Guild(data));
                break;
            }
            case GatewayDispatchEvents.GuildDelete: {
                const data = <Discord.GatewayGuildDeleteDispatchData>d;
                this.#client.guilds.remove(data.id);
                break;
            }
            case GatewayDispatchEvents.GuildRoleCreate: {
                const data = <Discord.GatewayGuildRoleCreateDispatchData>d;
                this.#client.guild(data.guild_id).roles.add(new Role(data.role));
                break;
            }
            case GatewayDispatchEvents.GuildRoleUpdate: {
                const data = <Discord.GatewayGuildRoleUpdateDispatchData>d;
                const guild = this.#client.guild(data.guild_id);
                guild.roles.update(new Role(data.role));
                /**
                 * Need to update because members will still have old role data when
                 * they are fetched from the guild. Don't need to do this for Create
                 * because a member update is only possible after the role is created
                 * and roles are passed on member update anyway. For Delete it is a
                 * similar story where Roles are removed from the users before the
                 * "GUILD_ROLE_DELETE" event, so there will never be a time when a
                 * non existent role is fetched. Update falls in the weird middle spot
                 * where a guild can have an updated role, while a member will not have 
                 * the updated role data until it is updated.
                **/
                for (const id in guild.members.keys()) {
                    if (guild.member(id).roles.has(data.role.id)) {
                        guild.member(id).guildRoles = guild.roles;
                    }
                }
                break;
            }
            case GatewayDispatchEvents.GuildRoleDelete: {
                const data = <Discord.GatewayGuildRoleDeleteDispatchData>d;
                this.#client.guild(data.guild_id).roles.remove(data.role_id);
                break;
            }
            case GatewayDispatchEvents.GuildMemberAdd: {
                const data = <Discord.GatewayGuildMemberAddDispatchData>d;
                this.#client.guild(data.guild_id).addMember(data);
                this.#client.users.update(new User(data.user!));
                break;
            }
            case GatewayDispatchEvents.GuildMemberUpdate: {
                const data = <Discord.GatewayGuildMemberUpdateDispatchData>d;
                this.#client.guild(data.guild_id).updateMember(data);
                this.#client.users.update(new User(data.user!));
                break;
            }
            case GatewayDispatchEvents.GuildMemberRemove: {
                const data = <Discord.GatewayGuildMemberRemoveDispatchData>d;
                this.#client.guild(data.guild_id).removeMember(data.user.id);
                this.#client.users.remove(data.user.id);
                break;
            }
            case GatewayDispatchEvents.PresenceUpdate: {
                const data = <Discord.GatewayPresenceUpdateDispatchData>d;
                this.#client.guild(data.guild_id).updateMember(data);
                this.#client.user(data.user.id).update(data);
                break;
            }
            case GatewayDispatchEvents.InteractionCreate: {
                const data = <Discord.GatewayInteractionCreateDispatchData>d;
                this.#client.commandHandler.executeCheck(data);
                break;
            }
            default: break;
        }
    }

}

export { EventHandler }