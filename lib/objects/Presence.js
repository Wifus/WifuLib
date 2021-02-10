"use strict";

const Base = require("./Base");
const User = require("./User");

module.exports = class Presence extends Base{
    /**
     * Represents a User's Presence
     * @arg {*} data 
     */
    constructor(data){
        super(data.user.id);
        /**@type {User} */
        this.user = new User(data.user);
        /**@type {String} */
        this.status = data.status;
    }

    update(data){
        const props = `status`;
        for(const prop of props.split(" ")){
            if(data[prop] !== undefined){
                this[prop] = data[prop];
            }
        }
        this.user.update(data.user);
        return this;
    }

    toString(){
        return this.user.mention;
    }

}