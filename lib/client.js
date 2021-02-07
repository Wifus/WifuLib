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

class Client extends RestAPIManager{
    constructor(token, options) {
        super(token);
        this.token = token;
        this.options = options;
        this.gateway = new WebSocketManager(this);
        this.eventHandler = new EventHandler(this);
        this.commandHandler = new CommandHandler(this);
        this.interactionManager = new InteractionManager(this);
        this.db = new SQLManager(options.login.db);

        this.commands = new Collection(Command);
        this.interactions = new Collection(Interaction);
        this.guilds = new Collection(Guild);
        this.users = new Collection(User);
        this.presences = new Collection(Presence);

        this.login();
    }

    login() {
        this.gateway.connect();
    }

    addCommand(command){
        if(command instanceof Command) {
            this.commands.add(command);
        }
    }

}

module.exports = Client;