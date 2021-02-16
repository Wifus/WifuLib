abstract class Base{

    #id: any;
    #createdAt: Date;
    #createdAtFormatted: string;

    constructor(id: any){
        this.#id = id;
        this.#createdAt = new Date(Math.floor(id/4194304) + 1420070400000);
        this.#createdAtFormatted = this.formatDate(this.#createdAt);
    }

    //Update this to be properly formatted
    formatDate(date: Date){
        return date.toLocaleString().split(" GMT")[0];
    }

    //Override
    update(data: any){return this;}

    get id(){return this.#id}
    get createdAt(){return this.#createdAt}
    get createdAtFormatted(){return this.#createdAtFormatted}

}

export { Base }