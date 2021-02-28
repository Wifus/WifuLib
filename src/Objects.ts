import { MemberData, RoleData, GuildData } from "./interfaces/data.ts";
import { snowflake, DiscordMember, DiscordPresenceUpdate } from "./interfaces/discord.ts";
import { Collection } from "./Collection.ts"

abstract class Base {

    #id: snowflake;
    #createdAt: Date;
    #createdAtFormatted: string;

    constructor(id: string) {
        this.#id = id;
        this.#createdAt = this.dateFromId(this.id);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    formatDate(date: Date) {
        return date.toLocaleString().split(" GMT")[0];
    }

    private dateFromId(snowflake: snowflake){
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

    constructor(data: MemberData) {
        super(data.id);
        this.#username = data.username;
        this.#discriminator = data.discriminator;
        this.#avatarHash = this.getAvatar(data.avatar);
        this.#bot = data.bot ?? false;
        this.#mention = `<@${this.id}>`;
        this.#status = data.status;
    }

    update(data: MemberData) {
        if (data.username !== undefined) {
            this.#username = data.username;
        }
        if (data.discriminator !== undefined) {
            this.#discriminator = data.discriminator;
        }
        if (data.avatar !== undefined) {
            this.#avatarHash = this.getAvatar(data.avatar);
        }
        if (data.status !== undefined) {
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

    constructor(data: RoleData) {
        super(data.id);
        this.#name = data.name;
        this.#color = data.color;
        this.#position = data.position;
    }

    update(data: RoleData) {
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

class Member extends User{
    
    #nick: string | undefined;
    #roles: Collection<Role, "id">;
    #joinedAt: Date;
    #joinedAtFormatted: string;
    #guildRoles: Collection<Role, "id">;
    #color: number;
    #hexColor: string;

    constructor(data: MemberData){
        super(data);
        this.#nick = data.nick;
        this.#roles = new Collection(Role, "id");
        this.#joinedAt = new Date(data.joinedAt ?? 0);
        this.#joinedAtFormatted  = this.formatDate(this.#joinedAt);
        this.#guildRoles = data.guildRoles!;
        this.#color = 0;
        this.#hexColor = "";

        if(data.roles){
            this.updateRoles(data.roles);
        }
    }

    update(data: MemberData){
        super.update(data);
        if(data.nick !== undefined) {
            this.#nick = data.nick;
        }
        if(data.guildRoles !== undefined) {
            this.#guildRoles = data.guildRoles;
        }
        if(data.roles){
            this.updateRoles(data.roles);
        }
    }

    private updateRoles(roles: string[]){
        this.#roles.clear();
        let orderedRoles: Role[] = [];
        for(const roleID of roles){
            orderedRoles.push(this.#guildRoles.get(roleID));
        }
        orderedRoles = orderedRoles.sort((a, b) => {
            return b.position - a.position;
        });
        for(const role of orderedRoles){
            this.#roles.add(role);
        }
        this.#color = orderedRoles[0]?.color;
        this.#hexColor = this.#color?.toString(16);
    }

    toString(){
        return this.mention;
    }

    get nick(){return this.#nick}
    get roles(){return this.#roles}
    get joinedAt(){return this.#joinedAt}
    get joinedAtFormatted(){return this.#joinedAtFormatted}
    get color(){return this.#color}
    get hexColor(){return this.#hexColor}

}

class Guild extends Base{

    #name: string;
    #roles: Collection<Role, "id">;
    #unavailable: boolean;
    #memberCount: number;
    #members: Collection<Member, "id">;
    
    constructor(data: GuildData){
        super(data.id);
        this.#name = data.name;
        this.#roles = new Collection(Role, "id");
        this.#unavailable = data.unavailable!;
        this.#memberCount = data.member_count!;
        this.#members = new Collection(Member, "id");

        for(const role of data.roles){
            this.#roles.add(new Role(role));
        }
        for(const member of data.members!){
            this.addMember(member, true);
        }
        for(const presence of data.presences!){
            const m = this.discordPresenceUpdateToMemberObject(presence);
            this.#members.update(m);
        }
    }

    update(data: GuildData){
        if(data.name !== undefined) {
            this.#name = data.name;
        }
        if(data.unavailable !== undefined) {
            this.#unavailable = data.unavailable;
        }
        return this;
    }

    addMember(member: DiscordMember, ignoreCount = false){
        const m = this.discordMemberToMemberObject(member);
        this.#members.add(m);
        if(!ignoreCount) {this.#memberCount = this.#members.size;}
    }

    updateMember(member: DiscordMember){
        const m = this.discordMemberToMemberObject(member);
        this.#members.update(m);
    }

    removeMember(id: string){
        const member = this.#members.get(id);
        if(member){
            this.#members.remove(member);
            this.#memberCount = this.#members.size;
        }
    }

    private discordMemberToMemberObject(member: DiscordMember){
        const m: MemberData = {
            id: member.user.id,
            username: member.user.username,
            discriminator: member.user.discriminator,
            avatar: member.user.avatar,
            bot: member.user.bot,
            guildRoles: this.#roles,
            nick: member.nick,
            roles: member.roles,
            joinedAt: member.joined_at
        }
        return new Member(m);
    }

    private discordPresenceUpdateToMemberObject(presence: DiscordPresenceUpdate){
        const m: MemberData = {
            id: presence.user.id,
            username: presence.user.username,
            discriminator: presence.user.discriminator,
            avatar: presence.user.avatar,
            bot: presence.user.bot,
            status: presence.status,
            guildRoles: this.#roles,
        }
        return new Member(m);
    }

    get name(){return this.#name}
    get roles(){return this.#roles}
    get unavailable(){return this.#unavailable}
    get memberCount(){return this.#memberCount}
    get members(){return this.#members}

}

export { User, Role, Member, Guild }