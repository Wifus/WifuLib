const Base = require("./Base");
const Collection = require("./Collection");
const Member = require("./Member");
const Role = require("./Role");
const Presence = require("./Presence");

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

    iconURL(size = 1024){
        return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}?size=${size}`
    }

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