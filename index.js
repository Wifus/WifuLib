const Client = require("./lib/client");

class Wifu extends Client{
    /**
     * Init the Client
     * @param {String} token 
     */
    constructor(token){
        super(token);
    }
}

Wifu.temp = 1;

module.exports = Wifu;