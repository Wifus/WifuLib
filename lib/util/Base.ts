abstract class Base {

    #id: string;
    #createdAt: Date;
    #createdAtFormatted: string;

    constructor(id: string){
        this.#id = id;
        // @ts-ignore
        this.#createdAt = new Date(Math.floor(id/4194304) + 1420070400000);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    //Update this to be properly formatted
    formatDate(date: Date){
        return `${date.toDateString()} ${date.toLocaleString("en-US", {hour: "numeric", minute: "2-digit"})}`;
    }

    get id(){return this.#id}
    get createdAt(){return this.#createdAt}
    get createdAtFormatted(){return this.#createdAtFormatted}

}

export { Base }