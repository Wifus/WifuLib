const Base = require("./Base");
const User = require("./User");

class Presence extends Base{
    constructor(data){
        super(data.user.id);
        this.user = new User(data.user);
        this.status = data.status;
    }

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