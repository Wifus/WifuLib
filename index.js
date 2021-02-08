const Client = require("./lib/client");

function Wifu(token, options) {
    return new Client(token, options);
}

Wifu.Command = require("./lib/structures/Command");
Wifu.Intents = require("./lib/constants").INTENTS;

module.exports = Wifu;