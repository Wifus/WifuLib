const Base = require("./Base");
const Collection = require("./Collection");
const Member = require("./Member");
const Role = require("./Role");
const Presence = require("./Presence");

/**
 * A Discord Guild (Server)
 * @extends Base
 * @prop {String} name Guild name
 * @prop {?String} icon Icon hash
 * @prop {Collection} roles Roles in guild
 * @prop {Boolean} unavailable True if this guild is unavailable due to an outage
 * @prop {Number} member_count Number of members in this guild
 * @prop {Collection} members Members in guild
 * @prop {Collection} presences Presences of members in guild
 */
class Guild extends Base{
    constructor(data){
        super(data.id);
        this.name = data.name;
        this.icon = data.icon;
        this.roles = new Collection(Role);
        this.unavailable = data.unavailable;
        this.member_count = data.member_count;
        this.members = new Collection(Member);
        this.presences = new Collection(Presence);

        for(const role of data.roles){
            this.roles.add(role);
        }
        for(const member of data.members){
            this.members.add(member, this.roles);
        }
        for(const presence of data.presences){
            this.presences.add(presence);
        }
    }

    /**
     * Get the guild's icon link
     * @param {Number} size Size of the icon
     * @returns {String}
     */
    iconURL(size = 1024){
        return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}?size=${size}`
    }

    /**
     * Update the guild
     * @param {Object} data The object data
     * @returns {Guild}
     */
    update(data){
        const properties = `name icon unavailable member_count`;
        for(const property of properties.split(" ")){
            if(data[property] !== undefined){
                this[property] = data[property];
            }
        }
        return this;
    }

}

module.exports = Guild;