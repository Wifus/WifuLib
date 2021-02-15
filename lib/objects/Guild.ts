import { Base } from "../util/Base.ts";
import { Collection } from "../util/Collection.ts";
import { Member } from "./Member.ts";
import { Role } from "./Role.ts";

class Guild extends Base{

    private _name: string;
    private _icon: string;
    private _roles: Collection;
    private _unavailable: boolean;
    private _memberCount: number;
    private _members: Collection;
    
    constructor(data: any){
        super(data.id);
        this._name = data.name;
        this._icon = data.icon;
        this._roles = new Collection(Role);
        this._unavailable = data.unavailable;
        this._memberCount = data.member_count;
        this._members = new Collection(Member);

        for(const role of data.roles){
            this._roles.add(role);
        }
        for(const member of data.members){
            this.addMember(member, true);
        }
        for(const presence of data.presences){
            this._members.update(presence);
        }
    }

    iconURL(size = 1024){
        const avatar = this._icon.startsWith("a_") ? `${this._icon}.gif` : `${this._icon}.png`;
        return `https://cdn.discordapp.com/icons/${this.id}/${avatar}?size=${size}`
    }

    update(data: any){
        if(data.name !== undefined) {
            this._name = data.name;
        }
        if(data.icon !== undefined) {
            this._icon = data.icon;
        }
        if(data.unavailable !== undefined) {
            this._unavailable = data.unavailable;
        }
        return this;
    }

    addMember(data: any, ignoreCount = false){
        const member = this._members.add({guildRoles: this._roles, ...data});
        if(!ignoreCount) {this._memberCount = this._members.size;}
        return member;
    }

    updateMember(data: any){
        const member = this._members.update({guildRoles: this._roles, ...data});
        return member;
    }

    removeMember(id: string){
        const member = this._members.remove({id});
        this._memberCount = this._members.size;
        return member;
    }

    get name(){return this._name}
    get roles(){return this._roles}
    get unavailable(){return this._unavailable}
    get memberCount(){return this._memberCount}
    get members(){return this._members}

}

export { Guild }