import BaseError from "./BaseError.ts"

class CommandSyntaxError extends BaseError {
    constructor(message: string) {
        super(message);
    }

    toString() {
        return `:no_entry_sign: **|** ${this.message}`
    }
}

export default CommandSyntaxError