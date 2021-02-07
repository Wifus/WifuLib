const Client = require("./lib/client");

function Wifu(token, options) {
    return new Client(token, options);
}

Wifu.Command = require("./lib/structures/Command");

module.exports = Wifu;