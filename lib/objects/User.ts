import { Base } from "../util/Base.ts";

class User extends Base{

    #username: string;
    #discriminator: string;
    #avatarHash: string;
    #bot: boolean;
    #mention: string;
    #status: string;

    constructor(data: any){
        super(data.id); //WILL CHANGE
        this.#username = data.username;
        this.#discriminator = data.discriminator;
        this.#avatarHash = data.avatar;
        this.#bot = data.bot ?? false;
        this.#mention = `<@${this.id}>`;
        this.#status = data.status;
    }

    avatarURL(size = 1024){
        const avatar = this.#avatarHash.startsWith("a_") ? `${this.#avatarHash}.gif` : `${this.#avatarHash}.png`;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    update(data: any){
        if(data.user){
            this.updateUser(data.user);
            if(data.status !== undefined){
                this.#status = data.status;
            }
        } else {
            this.updateUser(data);
        }
        return this;
    }

    private updateUser(data: any){
        if(data.username !== undefined) {
            this.#username = data.username;
        }
        if(data.discriminator !== undefined) {
            this.#discriminator = data.discriminator;
        }
        if(data.avatarHash !== undefined) {
            this.#avatarHash = data.avatarHash;
        }
    }

    toString(){
        return this.#mention;
    }
    
    get username(){return this.#username}
    get discriminator(){return this.#discriminator}
    get bot(){return this.#bot}
    get mention(){return this.#mention}
    get status(){return this.#status}

}

export { User }