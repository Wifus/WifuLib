import { Discord } from "../Types.ts"

class Embed {
    #title?: string;
    #description?: string;
    #url?: string;
    #timestamp?: string;
    #color?: number;
    #footerText?: string;
    #footerIconUrl?: string;
    #imageUrl?: string;
    #thumbnailUrl?: string;
    #authorName?: string;
    #authorUrl?: string;
    #authorIconUrl?: string;
    #fields: Discord.APIEmbedField[];

    constructor() {
        this.#fields = [];
    }

    title(title: string) { this.#title = title; return this; }
    description(description: string) { this.#description = description; return this; }
    url(url: string) { this.#url = url; return this; }
    timestamp(timestamp: Date) { this.#timestamp = timestamp.toISOString(); return this; }
    color(color: number) { this.#color = color; return this; }
    footerText(footerText: string) { this.#footerText = footerText; return this; }
    footerIconUrl(footerIconUrl: string) { this.#footerIconUrl = footerIconUrl; return this; }
    imageUrl(imageUrl: string) { this.#imageUrl = imageUrl; return this; }
    thumbnailUrl(thumbnailUrl: string) { this.#thumbnailUrl = thumbnailUrl; return this; }
    authorName(authorName: string) { this.#authorName = authorName; return this; }
    authorUrl(authorUrl: string) { this.#authorUrl = authorUrl; return this; }
    authorIconUrl(authorIconUrl: string) { this.#authorIconUrl = authorIconUrl; return this; }
    addField(name: string, value: string, inline = false) {
        this.#fields.push({ name, value, inline });
        return this;
    }

    get(): Discord.APIEmbed {
        return {
            title: this.#title,
            description: this.#description,
            url: this.#url,
            timestamp: this.#timestamp,
            color: this.#color,
            footer: this.#footerText ? {
                text: this.#footerText,
                icon_url: this.#footerIconUrl
            } : undefined,
            image: {
                url: this.#imageUrl
            },
            thumbnail: {
                url: this.#thumbnailUrl
            },
            author: {
                name: this.#authorName,
                url: this.#authorUrl,
                icon_url: this.#authorIconUrl
            },
            fields: this.#fields,
        }
    }

}

export default Embed