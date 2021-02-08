const Gateway = require("./handlers/WebSocket");
const Events = require("./handlers/Event");

module.exports = class Client{
    /**
     * Init the Client
     * @arg {String} token 
     */
    constructor(token) {
        /**@private @type {String} */
        this._token = token;
        /**@private @type {Gateway} */
        this._gateway = new Gateway(this);
        /**@private @type {Events} */
        this._events = new Events(this);

        this.login();
    }

    /**@private */
    login(){this.gateway.connect();}

    log(message){
        const now = new Date().toLocaleTimeString("it-IT");
        console.log(`[${now}] ${message}`);
    }

    /**@returns {String} */
    get token(){return this._token;}

    /**@returns {Gateway} */
    get gateway(){return this._gateway;}

    /**@returns {Events} */
    get events(){return this._events;}

}