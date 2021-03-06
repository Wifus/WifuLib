import { Discord } from "../Types.ts"

abstract class Base {

    #id: Discord.Snowflake
    #createdAt: Date
    #createdAtFormatted: string

    constructor(id: Discord.Snowflake) {
        this.#id = id;
        this.#createdAt = this.dateFromId(this.id);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    formatDate(date: Date) {
        return date.toLocaleString().split(" GMT")[0];
    }

    private dateFromId(snowflake: Discord.Snowflake) {
        return new Date(Number((BigInt(snowflake) >> 22n) + 1420070400000n));
    }

    get id() { return this.#id }
    get createdAt() { return this.#createdAt }
    get createdAtFormatted() { return this.#createdAtFormatted }

}

export default Base