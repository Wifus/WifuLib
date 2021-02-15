abstract class Base {

    private _id: string;
    private _createdAt: Date;
    private _createdAtFormatted: string;

    constructor(id: string){
        this._id = id;
        // @ts-ignore
        this._createdAt = new Date(Math.floor(id/4194304) + 1420070400000);
        this._createdAtFormatted = this.formatDate(this._createdAt);
    }

    //Update this to be properly formatted
    formatDate(date: Date){
        return `${date.toDateString()} ${date.toLocaleString("en-US", {hour: "numeric", minute: "2-digit"})}`;
    }

    get id(){return this._id}
    get createdAt(){return this._createdAt}
    get createdAtFormatted(){return this._createdAtFormatted}

}

export { Base }