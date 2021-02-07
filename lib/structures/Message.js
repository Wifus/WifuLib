const Base = require("./Base")

/**
 * A Discord Message
 * @extends Base
 * @prop {String} channel_id ID of the channel the message was sent in
 * @prop {Client} client The client 
 */
class Message extends Base{
    /**
     * Instanciate a message object
     * @param {Object} data 
     * @param {Client} client 
     */
    constructor(data, client){
        super(data.id);
        this.channel_id = data.channel_id;
        this.client = client;
    }

    async delete(timeout = 0){
        setTimeout(async () => {
            return await this.client.deleteMessage(this.channel_id, this.id);
        }, timeout);
    }

    async edit(message){
        return await this.client.editMessage(this.channel_id, this.id, message);
    }

}

module.exports = Message;