import { Discord } from "./deps.ts";

export { Client } from "./src/Client.ts";

const { GatewayIntentBits: Intents } = Discord;
export { Intents };

export { Command } from "./src/Objects.ts";

export type { p } from "./src/Types.ts";