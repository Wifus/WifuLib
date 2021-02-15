import { Base } from "../util/Base.ts";
import { Collection } from "../util/Collection.ts";
import { Member } from "./Member.ts";
import { Role } from "./Role.ts";

class Guild extends Base{

    #name: string;
    #icon: string;
    #roles: Collection;
    #unavailable: boolean;
    #memberCount: number;
    #members: Collection;
    
    constructor(data: any){
        super(data.id);
        this.#name = data.name;
        this.#icon = data.icon;
        this.#roles = new Collection(Role);
        this.#unavailable = data.unavailable;
        this.#memberCount = data.member_count;
        this.#members = new Collection(Member);

        for(const role of data.roles){
            this.#roles.add(role);
        }
        for(const member of data.members){
            this.addMember(member, true);
        }
        for(const presence of data.presences){
            this.#members.update(presence);
        }
    }

    iconURL(size = 1024){
        const avatar = this.#icon.startsWith("a_") ? `${this.#icon}.gif` : `${this.#icon}.png`;
        return `https://cdn.discordapp.com/icons/${this.id}/${avatar}?size=${size}`
    }

    update(data: any){
        if(data.name !== undefined) {
            this.#name = data.name;
        }
        if(data.icon !== undefined) {
            this.#icon = data.icon;
        }
        if(data.unavailable !== undefined) {
            this.#unavailable = data.unavailable;
        }
        return this;
    }

    addMember(data: any, ignoreCount = false){
        const member = this.#members.add({guildRoles: this.#roles, ...data});
        if(!ignoreCount) {this.#memberCount = this.#members.size;}
        return member;
    }

    updateMember(data: any){
        const member = this.#members.update({guildRoles: this.#roles, ...data});
        return member;
    }

    removeMember(id: string){
        const member = this.#members.remove({id});
        this.#memberCount = this.#members.size;
        return member;
    }

    get name(){return this.#name}
    get roles(){return this.#roles}
    get unavailable(){return this.#unavailable}
    get memberCount(){return this.#memberCount}
    get members(){return this.#members}

}

export { Guild }