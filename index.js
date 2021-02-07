const Client = require("./lib/Client");

function Wifu(token, options) {
    return new Client(token, options);
}

Wifu.Command = require("./lib/structures/Command");