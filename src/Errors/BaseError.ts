abstract class BaseError {

    #message?: string;

    constructor(message?: string) {
        this.#message = message;
    }

    get message() { return this.#message }

    abstract toString(): string;
}

export default BaseError