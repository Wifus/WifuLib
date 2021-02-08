const Client = require("../client");

module.exports = class EventHandler{
    /**
     * Init the websocket manager
     * @param {Client} client 
     */
    constructor(client) {
        /**@private @type {Client} */
        this.client = client;
    }
    
    async handleDispatch(payload){
        const {t, d} = payload;
    
        switch(t){
            case "READY":{
                this.client.gateway.session_id = d.session_id;
                break;}
            default:{
                break;}
        }
    }

}