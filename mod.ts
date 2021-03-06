import { Discord } from "./deps.ts"
import Client from "./src/Client.ts"
import Command from "./src/Objects/Command.ts"
import Reply from "./src/Builders/Reply.ts"
import CommandSyntaxError from "./src/Errors/CommandSyntaxError.ts"


const { GatewayIntentBits: Intents } = Discord

export { Client, Command, Intents, Reply, CommandSyntaxError }
export type { p } from "./src/Types.ts"
