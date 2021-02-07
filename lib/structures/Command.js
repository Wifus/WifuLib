const Base = require("./Base");

/**
 * Command class for bot slash commands
 * @extends Base
 * @prop {Number} cooldown Command cooldown in ms
 * @prop {Object} syntax Command syntax as per Discord's {@link https://discord.com/developers/docs/interactions/slash-commands#applicationcommand ApplicationCommand} object
 * @prop {Execute} execute Command execution function
 */
class Command extends Base{
	constructor(args){
        super(args.id);
        this.cooldown = args.cooldown;
        this.syntax = args.syntax
        this.execute = args.execute;
    }

}

/**
 * @callback Execute
 * @param {Object} p Paramaters
 */

module.exports = Command;