const Interaction = require("../structures/Interaction");

class InteractionManager {
    constructor(client){
        this.client = client;
    }

    onCooldown(command, user, p){
        const key = `${command.id}_${user.id}`;

        //Check if user has previous interaction with command
        const previousInteraction = this.client.interactions.get(key);

        if(!previousInteraction) {
            //If no previous interactions, then create a new one and return false (not on cooldown)
            this.client.interactions.add(new Interaction(command, user));
            return false;
        }

        //If there was a previous interaction
        //Get time left on cooldown

        const now = new Date();
        const timeLeft = command.cooldown - (now - previousInteraction.lastUsed);

        //Check if cooldown is active
        if(timeLeft > 0){
            //Cooldown is active
            //Check if they have been warned for cooldown
            if(previousInteraction.warned){
                //If already warned, there is nothing to do, return true
                return true;
            } 

            //If not already warned, warn and return true
            //Sorry Chris, stealing this warning message
            //https://github.com/ChristopherBThai/Discord-OwO-Bot/blob/bcff5516a0ab7943d41facab083bf976414e496d/src/utils/cooldown.js#L41
            p.cooldown(`:stopwatch: | **${user.username}**! Please wait **${this.msToTime(timeLeft)}** and try again!`, timeLeft);
            this.client.interactions.get(key).update(true);
            return true;
        }

        //Cooldown is not active
        //Update the interaction and return false
        this.client.interactions.get(key).update(false, now);
        return false;
    }

    msToTime(ms){
        const sec = Math.round(ms / 10) / 100;
        return `${sec}s`
    }

}

module.exports = InteractionManager;