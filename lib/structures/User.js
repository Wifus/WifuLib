const Base = require("./Base");

class User extends Base{

    constructor(data){
        super(data.id);
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot ? true : false;
        this.mention = `<@${this.id}>`;
    }

    avatarURL(size = 1024){
        const avatar = this.avatar.startsWith("a_") ? `${this.avatar}.gif` : this.avatar;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    update(data){
        const properties = `username discriminator avatar`;
        for(const property of properties.split(" ")){
            if(data[property] !== undefined) {
                this[property] = data[property];
            }
        }
        return this;
    }

    toString(){
        return this.mention;
    }

}

module.exports = User;