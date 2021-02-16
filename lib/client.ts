class Client {

    #token: string;

    constructor(token: string){
        this.#token = token;
    }

    log(message: string){
        const now = new Date().toLocaleString().split(" GMT")[0];
        console.log(`[${now}] ${message}`);
    }

    get token(){return this.#token}

}

export { Client };