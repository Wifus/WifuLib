import { Discord } from "../deps.ts";
import { Collection } from "./Collection.ts"
type UserAndMemberUpdateData =
    | Discord.APIUser
    | Discord.GatewayPresenceUpdate
    | Discord.APIGuildMember
    | Discord.GatewayGuildMemberUpdateDispatchData;

abstract class Base {

    #id: Discord.Snowflake;
    #createdAt: Date;
    #createdAtFormatted: string;

    constructor(id: Discord.Snowflake) {
        this.#id = id;
        this.#createdAt = this.dateFromId(this.id);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    formatDate(date: Date) {
        return date.toLocaleString().split(" GMT")[0];
    }

    private dateFromId(snowflake: Discord.Snowflake) {
        return new Date(Number((BigInt(snowflake) >> 22n) + 1420070400000n));
    }

    get id() { return this.#id }
    get createdAt() { return this.#createdAt }
    get createdAtFormatted() { return this.#createdAtFormatted }

}

class User extends Base {

    #username: string;
    #discriminator: string;
    #avatarHash: string;
    #bot: boolean;
    #mention: string;
    #status: string | undefined;

    constructor(data: Discord.APIUser) {
        super(data.id);
        this.#username = data.username;
        this.#discriminator = data.discriminator;
        this.#avatarHash = this.getAvatar(data.avatar);
        this.#bot = data.bot ?? false;
        this.#mention = `<@${this.id}>`;
    }

    update(data: UserAndMemberUpdateData) {
        if ("username" in data && data.username !== undefined) {
            this.#username = data.username;
        }
        if ("discriminator" in data && data.discriminator !== undefined) {
            this.#discriminator = data.discriminator;
        }
        if ("avatar" in data && data.avatar !== undefined) {
            this.#avatarHash = this.getAvatar(data.avatar);
        }
        if ("status" in data && data.status !== undefined) {
            this.#status = data.status;
        }
    }

    avatarURL(size = 1024) {
        if (this.#avatarHash == "default") {
            const mod5 = parseInt(this.#discriminator) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${mod5}.png`
        }
        const avatar = this.#avatarHash.startsWith("a_") ? `${this.#avatarHash}.gif` : `${this.#avatarHash}.png`;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    protected getAvatar(data: string | null) {
        const isDefault = data ?? "default";
        if (isDefault == "default") return isDefault;
        const avatar = isDefault.startsWith("a_") ? `${isDefault}.gif` : `${isDefault}.png`;
        return avatar;
    }

    toString() {
        return this.#mention;
    }

    get username() { return this.#username }
    get discriminator() { return this.#discriminator }
    get bot() { return this.#bot }
    get mention() { return this.#mention }
    get status() { return this.#status }

}

class Role extends Base {

    #name: string
    #color: number;
    #position: number;

    constructor(data: Discord.APIRole) {
        super(data.id);
        this.#name = data.name;
        this.#color = data.color;
        this.#position = data.position;
    }

    update(data: Discord.APIRole) {
        if (data.name !== undefined) {
            this.#name = data.name;
        }
        if (data.color !== undefined) {
            this.#color = data.color;
        }
        if (data.position !== undefined) {
            this.#position = data.position;
        }
    }

    toString() {
        return `<@&${this.id}>`;
    }

    get name() { return this.#name }
    get color() { return this.#color }
    get position() { return this.#position }

}

class Member extends User {

    #nick: string | undefined | null;
    #roles: Collection<Role, "id">;
    #joinedAt: Date;
    #joinedAtFormatted: string;
    #guildRoles: Collection<Role, "id">;
    #color: number | undefined;
    #hexColor: string | undefined;

    constructor(data: Discord.APIGuildMember, guildRoles: Collection<Role, "id">) {
        super(data.user!);
        this.#nick = data.nick;
        this.#roles = new Collection(Role, "id");
        this.#joinedAt = new Date(data.joined_at ?? 0);
        this.#joinedAtFormatted = this.formatDate(this.#joinedAt);
        this.#guildRoles = guildRoles;

        if (data.roles) {
            this.updateRoles(data.roles);
        }
    }

    update(data: UserAndMemberUpdateData) {
        super.update(data);
        if ("nick" in data && data.nick !== undefined) {
            this.#nick = data.nick;
        }
        if ("roles" in data && data.roles !== undefined) {
            this.updateRoles(data.roles);
        }
    }

    updateRoles(roles: string[]) {
        this.#roles.clear();
        let orderedRoles: Role[] = [];
        for (const roleID of roles) {
            orderedRoles.push(this.#guildRoles.get(roleID));
        }
        orderedRoles = orderedRoles.sort((a, b) => {
            return b.position - a.position;
        });
        for (const role of orderedRoles) {
            this.#roles.add(role);
        }
        this.#color = orderedRoles[0]?.color;
        this.#hexColor = this.#color?.toString(16);
    }

    toString() {
        return this.mention;
    }

    get nick() { return this.#nick }
    get roles() { return this.#roles }
    get joinedAt() { return this.#joinedAt }
    get joinedAtFormatted() { return this.#joinedAtFormatted }
    get color() { return this.#color }
    get hexColor() { return this.#hexColor }
    set guildRoles(guildRoles: Collection<Role, "id">) { this.#guildRoles = guildRoles }

}

class Guild extends Base {

    #name: string;
    #roles: Collection<Role, "id">;
    #unavailable: boolean;
    #memberCount: number;
    #members: Collection<Member, "id">;

    constructor(data: Discord.APIGuild) {
        super(data.id);
        this.#name = data.name;
        this.#roles = new Collection(Role, "id");
        this.#unavailable = data.unavailable!;
        this.#memberCount = data.member_count!;
        this.#members = new Collection(Member, "id");

        for (const role of data.roles) {
            this.#roles.add(new Role(role));
        }
        for (const member of data.members!) {
            this.addMember(member);
        }
        for (const presence of data.presences!) {
            this.updateMember(presence);
        }
    }

    update(data: Discord.APIGuild) {
        if (data.name !== undefined) {
            this.#name = data.name;
        }
        if (data.unavailable !== undefined) {
            this.#unavailable = data.unavailable;
        }
    }

    addMember(member: Discord.APIGuildMember) {
        this.#members.add(new Member(member, this.#roles));
        this.#memberCount = this.#members.size;
    }

    updateMember(member: UserAndMemberUpdateData) {
        let id: Discord.Snowflake;
        if ("id" in member) { id = member.id }
        else { id = member.user!.id; }
        this.member(id).update(member);
    }

    removeMember(id: Discord.Snowflake) {
        if (this.#members.get(id)) {
            this.#members.remove(id);
            this.#memberCount = this.#members.size;
        }
    }

    get name() { return this.#name }
    get roles() { return this.#roles }
    get unavailable() { return this.#unavailable }
    get memberCount() { return this.#memberCount }
    get members() { return this.#members }
    member(id: string) { return this.#members.get(id) }

}

export { User, Role, Member, Guild }