const Base = require("./Base");
const User = require("./User");
const Collection = require("./Collection");
const Role = require("./Role");

/**
 * A Guild Member
 * @extends Base
 * @prop {User} user User this guild member represents
 * @prop {?String} nick Member's guild nickname
 * @prop {Collection} roles Member's roles
 * @prop {Date} joinedAt Date the user joined the guild
 * @prop {String} joinedAtFormatted Formatted string of the joinedAt date
 * @prop {Collection} guildRoles The roles in the guild the user is a member of
 * @prop {Number} color Integer representation of the hexadecimal color code of the member
 * @prop {Array<Role>} orderedRoles Array of member roles with "higher" roles being first in the array
 */
class Member extends Base{
    constructor(data, guildRoles){
        super(data.user.id);
        this.user = new User(data.user);
        this.nick = data.nick;
        this.roles = new Collection(Role);
        this.joinedAt = new Date(data.joined_at);
        this.joinedAtFormatted  = this.formatDate(this.joinedAt);
        this.guildRoles = guildRoles;
        this.color = 0;
        this.orderedRoles = [];
        this.hexColor = "";

        this.updateRoles(data.roles);
    }

    /**
     * Update the member
     * @param {Object} data The object data
     * @param {Collection} guildRoles Collection of roles in the guild the member is a part of
     * @returns {Member}
     */
    update(data, guildRoles){
        const properties = `nick`;
        for(const property of properties.split(" ")){
            if(data[property] !== undefined){
                this[property] = data[property];
            }
        }
        //Get latest roles
        if(guildRoles !== undefined){
            this.guildRoles = guildRoles;
        }
        //Update user
        this.user.update(data.user);
        //Update roles
        this.updateRoles(data.roles);

        return this;
    }

    /**
     * Update the member's roles
     * @param {Array<String>} roles Array of role IDs
     */
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

module.exports = Member;