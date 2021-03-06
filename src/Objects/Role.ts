import { Discord } from "../Types.ts"
import Base from "./Base.ts"

class Role extends Base {

    #name: string;
    #color: number;
    #position: number;

    constructor(data: Discord.APIRole) {
        super(data.id);
        this.#name = data.name;
        this.#color = data.color;
        this.#position = data.position;
    }

    update(data: Discord.APIRole) {
        if (data.name !== undefined) {
            this.#name = data.name;
        }
        if (data.color !== undefined) {
            this.#color = data.color;
        }
        if (data.position !== undefined) {
            this.#position = data.position;
        }
    }

    toString() {
        return `<@&${this.id}>`;
    }

    get name() { return this.#name }
    get color() { return this.#color }
    get position() { return this.#position }

}

export default Role