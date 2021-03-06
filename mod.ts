import { Discord } from "./deps.ts"
const { GatewayIntentBits: Intents } = Discord
export { Intents };
import Client from "./src/Client.ts"
export { Client }
export { Command } from "./src/Objects.ts"
export type { p } from "./src/Types.ts"
export { Reply } from "./src/Builders.ts"
export { CommandSyntaxError } from "./src/Errors.ts"