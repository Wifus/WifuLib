"use strict";

const Base = require("./Base");

module.exports = class Role extends Base{
    /**
     * Represents a Discord Role
     * @param {*} data 
     */
    constructor(data){
        super(data.id);
        /**@type {String} */
        this.name = data.name;
        /**@type {Number} */
        this.color = data.color;
        /**@type {Number} */
        this.position = data.position;
    }

    update(data){
        const props = `name color position`;
        for(const prop of props.split(" ")){
            if(data[prop] !== undefined){
                this[prop] = data[prop];
            }
        }
        return this;
    }

    toString(){
        return `<@&${this.id}>`;
    }
    
}
