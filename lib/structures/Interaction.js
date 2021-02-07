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