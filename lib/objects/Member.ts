import { Collection } from "../util/Collection.ts"
import { User } from "./User.ts";
import { Role } from "./Role.ts";

class Member extends User{
    
    #nick: string;
    #roles: Collection;
    #joinedAt: Date;
    #joinedAtFormatted: string;
    #guildRoles: Collection;
    #color: number;
    #hexColor: string;

    constructor(data: any){
        super(data.user);
        this.#nick = data.nick;
        this.#roles = new Collection(Role);
        this.#joinedAt = new Date(data.joined_at);
        this.#joinedAtFormatted  = this.formatDate(this.#joinedAt);
        this.#guildRoles = data.guildRoles;
        this.#color = 0;
        this.#hexColor = "";

        if(data.roles){
            this.updateRoles(data.roles);
        }
    }

    update(data: any){
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
        return this;
    }

    updateRoles(roles: string[]){
        this.#roles.clear();
        let orderedRoles = [];
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

export { Member }