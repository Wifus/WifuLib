const Base = require("./Base");

/**
 * A Discord User
 * @extends Base
 * @prop {String} username User's username
 * @prop {String} discriminator User's 4-digit Discord tag
 * @prop {?String} avatar User's avatar hash
 * @prop {Boolean} bot Whether the user is a bot
 * @prop {String} mention User's mention string
 */
class User extends Base{

    constructor(data){
        super(data.id);
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot ? true : false;
        this.mention = `<@${this.id}>`;
    }

    /**
     * Get the user's avatar link
     * @param {Number} size Size of the icon
     * @returns {String}
     */
    avatarURL(size = 1024){
        const avatar = this.avatar.startsWith("a_") ? `${this.avatar}.gif` : this.avatar;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    /**
     * Update the user
     * @param {Object} data The object data
     * @returns {User}
     */
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