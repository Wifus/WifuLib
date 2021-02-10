"use strict";

const Gateway = require("./handlers/WebSocket");
const Events = require("./handlers/Event");

const Collection = require("./objects/Collection");
const User = require("./objects/User");
const Presence = require("./objects/Presence");
const Guild = require("./objects/Guild");

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
        /**@type {Collection} */
        this.guilds = new Collection(Guild);
        /**@type {Collection} */
        this.users = new Collection(User);
        /**@type {Collection} */
        this.presences = new Collection(Presence);

        this.login();
    }

    /**@private */
    login(){this.gateway.connect();}

    /**@static */
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

    /**@returns {Guild} */
    guild(id){return this.guilds.get(id)}

    /**@returns {User} */
    user(id){return this.users.get(id)}

    /**@returns {Presence} */
    presence(id){return this.presences.get(id)}

}