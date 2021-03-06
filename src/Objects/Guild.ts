import Base from "./Base.ts"
import Collection from "./Collection.ts"
import Role from "./Role.ts"
import Member from "./Member.ts"
import { Discord, UserAndMemberUpdateData } from "../Types.ts"

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

export default Guild