//deno-lint-ignore-file no-explicit-any
class Collection<T extends { update(data: any): void }, K extends keyof T> extends Map {

    #baseClass: new (...args: any[]) => T;
    #primaryKey: K;

    constructor(baseClass: new (...args: any[]) => T, primaryKey: K) {
        super();
        this.#baseClass = baseClass;
        this.#primaryKey = primaryKey;
    }

    get(key: any): T {
        return super.get(key);
    }

    add(object: T): void {
        this.set(object[this.#primaryKey], object);
    }

    update(object: T): void {
        const value = this.get(object[this.#primaryKey]);
        if (!value) { this.add(object); }
        else { value.update(object); }
    }

    remove(key: any): void {
        const value = this.get(key);
        if (!value) { return; }
        else { this.delete(key); }
        return;
    }

    toString() {
        return `[Collection<${this.#baseClass.name}>]`;
    }

}

export { Collection }