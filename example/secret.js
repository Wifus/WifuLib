const {Intents} = require("wifu");

const TOKEN = "bot token";
const db = {
    host: "host",
    port: 3306,
    user: "user",
    password: "password",
    database: "database",
}

module.exports = {
    TOKEN,
    OPTIONS: {
        login: {
            db
        },
        intents: [
            Intents.GUILDS, 
            Intents.GUILD_MEMBERS, 
            Intents.GUILD_PRESENCES,
            Intents.GUILD_MESSAGES
        ]
    }
}