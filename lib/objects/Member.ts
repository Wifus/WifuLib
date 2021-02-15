import { Collection } from "../util/Collection.ts"
import { User } from "./User.ts";
import { Role } from "./Role.ts";

class Member extends User{
    
    private _nick: string;
    private _roles: Collection;
    private _joinedAt: Date;
    private _joinedAtFormatted: string;
    private _guildRoles: Collection;
    private _color: number;
    private _hexColor: string;

    constructor(data: any){
        super(data.user);
        this._nick = data.nick;
        this._roles = new Collection(Role);
        this._joinedAt = new Date(data.joined_at);
        this._joinedAtFormatted  = this.formatDate(this._joinedAt);
        this._guildRoles = data.guildRoles;
        this._color = 0;
        this._hexColor = "";

        if(data.roles){
            this.updateRoles(data.roles);
        }
    }

    update(data: any){
        super.update(data);
        if(data.nick !== undefined) {
            this._nick = data.nick;
        }
        if(data.guildRoles !== undefined) {
            this._guildRoles = data.guildRoles;
        }
        if(data.roles){
            this.updateRoles(data.roles);
        }
        return this;
    }

    updateRoles(roles: string[]){
        this._roles.clear();
        let orderedRoles = [];
        for(const roleID of roles){
            orderedRoles.push(this._guildRoles.get(roleID));
        }
        orderedRoles = orderedRoles.sort((a, b) => {
            return b.position - a.position;
        });
        for(const role of orderedRoles){
            this._roles.add(role);
        }
        this._color = orderedRoles[0]?.color;
        this._hexColor = this._color?.toString(16);
    }

    toString(){
        return this.mention;
    }

    get nick(){return this._nick}
    get roles(){return this._roles}
    get joinedAt(){return this._joinedAt}
    get joinedAtFormatted(){return this._joinedAtFormatted}
    get color(){return this._color}
    get hexColor(){return this._hexColor}

}

export { Member }