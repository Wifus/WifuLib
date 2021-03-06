import { Discord, UserAndMemberUpdateData } from "../Types.ts"
import Base from "./Base.ts"

class User extends Base {

    #username: string;
    #discriminator: string;
    #avatarHash: string;
    #bot: boolean;
    #mention: string;
    #status: string | undefined;

    constructor(data: Discord.APIUser) {
        super(data.id);
        this.#username = data.username;
        this.#discriminator = data.discriminator;
        this.#avatarHash = this.getAvatar(data.avatar);
        this.#bot = data.bot ?? false;
        this.#mention = `<@${this.id}>`;
    }

    update(data: UserAndMemberUpdateData) {
        if ("username" in data && data.username !== undefined) {
            this.#username = data.username;
        }
        if ("discriminator" in data && data.discriminator !== undefined) {
            this.#discriminator = data.discriminator;
        }
        if ("avatar" in data && data.avatar !== undefined) {
            this.#avatarHash = this.getAvatar(data.avatar);
        }
        if ("status" in data && data.status !== undefined) {
            this.#status = data.status;
        }
    }

    avatarURL(size = 1024) {
        if (this.#avatarHash == "default") {
            const mod5 = parseInt(this.#discriminator) % 5;
            return `https://cdn.discordapp.com/embed/avatars/${mod5}.png`
        }
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.#avatarHash}?size=${size}`
    }

    protected getAvatar(data: string | null) {
        const isDefault = data ?? "default";
        if (isDefault == "default") return isDefault;
        const avatar = isDefault.startsWith("a_") ? `${isDefault}.gif` : `${isDefault}.png`;
        return avatar;
    }

    toString() {
        return this.#mention;
    }

    get username() { return this.#username }
    get discriminator() { return this.#discriminator }
    get bot() { return this.#bot }
    get mention() { return this.#mention }
    get status() { return this.#status }

}

export default User