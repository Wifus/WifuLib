"use strict";

const Base = require("./Base");
const User = require("./User");
const Collection = require("./Collection");
const Role = require("./Role");

module.exports = class Member extends Base{
    /**
     * Represents a Guild Member
     * @arg {*} data 
     */
    constructor(data){
        super(data.user.id);
        /**@type {User} */
        this.user = new User(data.user);
        /**@type {String} */
        this.nick = data.nick;
        /**@type {Collection} */
        this.roles = new Collection(Role);
        /**@type {Date} */
        this.joinedAt = new Date(data.joined_at);
        /**@type {String} */
        this.joinedAtFormatted  = this.formatDate(this.joinedAt);
        /**@type {Collection} */
        this.guildRoles = data.guildRoles;
        /**@type {Number} */
        this.color = 0;
        /**@type {Array<Role>} */
        this.orderedRoles = [];
        /**@type {String} */
        this.hexColor = "";

        this.updateRoles(data.roles);
    }

    update(data){
        const props = `nick guildRoles`;
        for(const prop of props.split(" ")){
            if(data[prop] !== undefined){
                this[prop] = data[prop];
            }
        }
        //Update user
        this.user.update(data.user);
        //Update roles
        this.updateRoles(data.roles);

        return this;
    }

    updateRoles(roles){
        this.roles.clear();
        for(const roleID of roles){
            const role = this.guildRoles.get(roleID);
            this.roles.add(role);
        }

        this.orderedRoles = Array.from(this.roles.values()).sort((a, b) => {
            return b.position - a.position;
        });

        this.color = this.orderedRoles[0]?.color;
        this.hexColor = this.color?.toString(16);
    }

    toString(){
        return this.user.mention;
    }

}