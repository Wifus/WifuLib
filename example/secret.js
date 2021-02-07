const TOKEN = "bot token";
const db = {
    host: "xxx.xxx.x.xxx",
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
        }
    }
}