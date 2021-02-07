const Base = require("./Base");
const User = require("./User");

/**
 * A User's Presence data
 * @extends Base
 * @prop {User} user User the presence data belongs to
 * @prop {String} status The user's status
 */
class Presence extends Base{
    constructor(data){
        super(data.user.id);
        this.user = new User(data.user);
        this.status = data.status;
    }

    /**
     * Update the presence data
     * @param {Object} data The object data
     * @returns {Presence}
     */
    update(data){
        const properties = `status`;
        for(const property of properties.split(" ")){
            if(data[property] !== undefined){
                this[property] = data[property];
            }
        }
        this.user.update(data.user);
        return this;
    }

    toString(){
        return this.user.mention;
    }

}

module.exports = Presence;