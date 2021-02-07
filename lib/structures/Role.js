const Base = require("./Base");

class Role extends Base{
    constructor(data){
        super(data.id);
        this.name = data.name;
        this.color = data.color;
        this.position = data.position;
    }

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