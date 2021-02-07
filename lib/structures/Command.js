const Base = require("./Base");

class Command extends Base{
	constructor(args){
        super(args.id);
        this.cooldown = args.cooldown;
        this.syntax = args.syntax
        this.execute = args.execute;
    }

}

module.exports = Command;