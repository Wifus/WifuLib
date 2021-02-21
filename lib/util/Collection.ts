//deno-lint-ignore-file no-explicit-any
import { Base } from "./Base.ts";

class Collection<V extends Base<V>> extends Map {

    #baseClass: new (...args: unknown[]) => V;
    #primaryKey: string;

    constructor(baseClass: new (arg0?: unknown, arg1?: unknown) => V, primaryKey = "id") {
        super();
        this.#baseClass = baseClass;
        this.#primaryKey = primaryKey;
    }

    get(key: any): V {
        return super.get(key);
    }

    add(object: any): V {
        if (!(object instanceof this.#baseClass || object.constructor.name === this.#baseClass.name)) {
            object = new this.#baseClass(object);
        }
        this.set(object[this.#primaryKey], object);
        return object;
    }

    update(object: any): V {
        const value = this.get(object[this.#primaryKey]);
        if (!value) {
            return this.add(object);
        }
        return value.update(object);
    }

    remove(object: any): V | null {
        const value = this.get(object[this.#primaryKey]);
        if (!value) {
            return null;
        }
        this.delete(object[this.#primaryKey]);
        return value;
    }

    toString() {
        return `[Collection<${this.#baseClass.name}>]`;
    }

}

export { Collection }