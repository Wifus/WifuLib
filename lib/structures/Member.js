const Base = require("./Base");
const User = require("./User");
const Collection = require("./Collection");
const Role = require("./Role");

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