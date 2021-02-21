import { snowflake } from "../interfaces/discord.ts";

abstract class Base<U>{

    #id: snowflake;
    #msSinceDiscordEpoch: number;
    #createdAt: Date;
    #createdAtFormatted: string;

    constructor(id: string) {
        this.#id = id;
        //@ts-ignore Bleh, js does not like converting large numbers into strings
        this.#msSinceDiscordEpoch = Math.floor(id / 4194304);
        this.#createdAt = new Date(this.#msSinceDiscordEpoch + 1420070400000);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    formatDate(date: Date) {
        return date.toLocaleString().split(" GMT")[0];
    }

    //Override
    abstract update(data: unknown): U;

    get id() { return this.#id }
    get createdAt() { return this.#createdAt }
    get createdAtFormatted() { return this.#createdAtFormatted }

}

export { Base }