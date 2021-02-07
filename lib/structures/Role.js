const Base = require("./Base");

/**
 * A Discord Role
 * @extends Base
 * @prop {String} name Role name
 * @prop {Number} color Integer representation of the hexadecimal color code
 * @prop {Number} position Position of this role. Higher number = Higher Position
 */
class Role extends Base{
    constructor(data){
        super(data.id);
        this.name = data.name;
        this.color = data.color;
        this.position = data.position;
    }

    /**
     * Update the role
     * @param {Object} data The object data
     * @returns {Role}
     */
    update(data){
        const properties = `name color hoist position permissions mentionable`;
        for(const property of properties.split(" ")){
            if(data[property] !== undefined){
                this[property] = data[property];
            }
        }
        return this;
    }

    toString(){
        return `<@&${this.id}>`;
    }
    
}

module.exports = Role;