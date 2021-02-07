const {readdirSync} = require('fs');

const WebSocketManager = require("./handlers/WebSocketManager");
const RestAPIManager = require ("./handlers/RestAPIManager");
const EventHandler = require("./handlers/EventHandler");
const CommandHandler = require("./handlers/CommandHandler");
const InteractionManager = require("./handlers/InteractionManager");
const SQLManager = require("./handlers/SQLManager");

const Collection = require("./structures/Collection");
const User = require("./structures/User");
const Presence = require("./structures/Presence");
const Guild = require("./structures/Guild");
const Command = require("./structures/Command");
const Interaction = require("./structures/Interaction");

/**
 * The Client
 * @extends RestAPIManager
 * @prop {String} token The Bot token
 * @prop {WebSocketManager} gateway The Gateway connection
 * @prop {EventHandler} eventHandler Responsible for handling Dispatch events
 * @prop {CommandHandler} commandHandler Responsible for handling Interaction events
 * @prop {InteractionManager} interactionManager Responsible for managing interactions property
 * @prop {SQLManager} db Responsible for requests to the database
 * @prop {Collection} commands Commands the bot has
 * @prop {Collection} interactions User interactions with commands
 * @prop {Collection} guilds Guilds the bot is in
 * @prop {Collection} users Users in the guilds the bot is in
 * @prop {Collection} presences Presences of the users the bot caches
 */
class Client extends RestAPIManager{
    constructor(token) {
        super(token);
        this.token = token;
        this.gateway = new WebSocketManager(this);
        this.eventHandler = new EventHandler(this);
        this.commandHandler = new CommandHandler(this);
        this.interactionManager = new InteractionManager(this);
        this.db = new SQLManager();

        this.commands = new Collection(Command);
        this.interactions = new Collection(Interaction);
        this.guilds = new Collection(Guild);
        this.users = new Collection(User);
        this.presences = new Collection(Presence);

        this.login();
        this.registerCommands();
    }

    login() {
        this.gateway.connect();
    }

    async registerCommands(){
        readdirSync("./src/commands").forEach(file => {
            const command = require(`../src/commands/${file}`);
            if(command instanceof Command) {this.commands.add(command)}
        });
    }

}

module.exports = Client;