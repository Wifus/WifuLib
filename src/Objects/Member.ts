import User from "./User.ts"
import Collection from "./Collection.ts"
import Role from "./Role.ts"
import { Discord, UserAndMemberUpdateData } from "../Types.ts"

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

export default Member