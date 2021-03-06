import Base from "./Base.ts"
import { Discord, CommandExecute } from "../Types.ts"


interface CommandOptions {
    id: Discord.Snowflake;
    cooldown: number;
    syntax: Discord.RESTPostAPIApplicationCommandsJSONBody;
    execute: CommandExecute;
}

class Command extends Base {

    #cooldown: number;
    #name: string;
    #execute: CommandExecute;

    constructor(args: CommandOptions) {
        super(args.id);
        this.#cooldown = args.cooldown;
        this.#name = args.syntax.name;
        this.#execute = args.execute;
    }

    get cooldown() { return this.#cooldown }
    get name() { return this.#name }
    get execute() { return this.#execute }

}

export default Command