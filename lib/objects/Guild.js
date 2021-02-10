"use strict";

const Base = require("./Base");
const Collection = require("./Collection");
const Member = require("./Member");
const Role = require("./Role");
const Presence = require("./Presence");

module.exports = class Guild extends Base{
    /**
     * Represents a Discord Guild (Server)
     * @param {*} data 
     */
    constructor(data){
        super(data.id);
        /**@type {String} */
        this.name = data.name;
        /**@type {String} */
        this.icon = data.icon;
        /**@type {Collection} */
        this.roles = new Collection(Role);
        /**@type {Boolean} */
        this.unavailable = data.unavailable;
        /**@type {Number} */
        this.member_count = data.member_count;
        /**@type {Collection} */
        this.members = new Collection(Member);
        /**@type {Collection} */
        this.presences = new Collection(Presence);

        for(const role of data.roles){
            this.roles.add(role);
        }
        for(const member of data.members){
            const guildRoles = {foo: this.roles};
            this.members.add({guildRoles, ...member});
        }
        for(const presence of data.presences){
            this.presences.add(presence);
        }
    }

    iconURL(size = 1024){
        return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}?size=${size}`
    }

    update(data){
        const props = `name icon unavailable member_count`;
        for(const prop of props.split(" ")){
            if(data[prop] !== undefined){
                this[prop] = data[prop];
            }
        }
        return this;
    }

}