import { Base } from "../util/Base.ts";

class User extends Base{

    private _username: string;
    private _discriminator: string;
    private _avatarHash: string;
    private _bot: boolean;
    private _mention: string;
    private _status: string;

    constructor(data: any){
        if(data.user){
            super(data.user.id);
        } else {
            super(data.id);
        }
        this._username = data.username;
        this._discriminator = data.discriminator;
        this._avatarHash = data.avatar;
        this._bot = data.bot ?? false;
        this._mention = `<@${this.id}>`;
        this._status = data.status;
    }

    avatarURL(size = 1024){
        const avatar = this._avatarHash.startsWith("a_") ? `${this._avatarHash}.gif` : `${this._avatarHash}.png`;
        return `https://cdn.discordapp.com/avatars/${this.id}/${avatar}?size=${size}`
    }

    update(data: any){
        if(data.user){
            this.updateUser(data.user);
            if(data.status !== undefined){
                this._status = data.status;
            }
        } else {
            this.updateUser(data);
        }
        return this;
    }

    private updateUser(data: any){
        if(data.username !== undefined) {
            this._username = data.username;
        }
        if(data.discriminator !== undefined) {
            this._discriminator = data.discriminator;
        }
        if(data.avatarHash !== undefined) {
            this._avatarHash = data.avatarHash;
        }
    }

    toString(){
        return this._mention;
    }
    
    get username(){return this._username}
    get discriminator(){return this._discriminator}
    get bot(){return this._bot}
    get mention(){return this._mention}
    get status(){return this._status}

}

export { User }