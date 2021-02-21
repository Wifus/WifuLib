/*
*   Target types for Discord Objects for ease of data processing
*/
import { DiscordUser } from "./discord.ts";

export interface UserData extends DiscordUser {
    status: "idle" | "dnd" | "online" | "offline" | null;
}