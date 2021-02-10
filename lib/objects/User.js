"use strict";

const Base = require("./Base");

module.exports = class User extends Base{
    /**
     * Represents a Discord User
     * @arg {*} data 
     */
    constructor(data){
        super(data.id);
        /**@type {String} */
        this.username = data.username;
        /**@type {String} */
        this.discriminator = data.discriminator;
        /**@type {String} */
        this.avatar = data.avatar;
        /**@type {Boolean} */
        this.bot = data.bot ? true : false;
        /**@type {String} */
        this.mention = `<@${this.id}>`;
    }

    /**
     * Get a link to the User's avatar
     * @arg {Number?} size 
     * @returns {String}
     */
    avatarURL(size = 1024){
        const avatar = this.avatar.startsWith("a_") ? `${this.avatar}.gif` : this.avatar;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    update(data){
        const props = `username discriminator avatar`;
        for(const prop of props.split(" ")){
            if(data[prop] !== undefined) {
                this[prop] = data[prop];
            }
        }
        return this;
    }

    toString(){
        return this.mention;
    }

}