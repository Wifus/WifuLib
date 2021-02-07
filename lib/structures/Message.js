const Base = require("./Base")

class Message extends Base{
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