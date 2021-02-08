const Client = require("./lib/client");

function Wifu(token, options) {
    return new Client(token, options);
}

module.exports = Wifu;