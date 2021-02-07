/**
 * Interaction object used for cooldown handling
 * @prop {String} id Key string formatted: `${command.id}_${user.id}`
 * @prop {Date} lastUsed Date for the last time a command was used by a user
 * @prop {Command} command Command of interaction
 * @prop {User} user User of interaction
 * @prop {Boolean} warned Wether or not the user has been warned for being on cooldown 
 */
class Interaction {
    constructor(command, user){
        this.id = `${command.id}_${user.id}`;
        this.lastUsed = new Date();
        this.command = command;
        this.user = user;
        this.warned = false;
    }

    update(warned, date){
        if(warned !== undefined){
            this.warned = warned;
        }
        if(date !== undefined){
            this.lastUsed = date;
        }
        return this;
    }
}

module.exports = Interaction;