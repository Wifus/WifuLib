"use strict";

module.exports = class EventHandler{
    /**
     * Init the websocket manager
     * @param {import("../client")} client 
     */
    constructor(client) {
        /**@private @type {import("../client")} */
        this.client = client;
    }
    
    async handleDispatch(payload){
        const {t, d} = payload;
    
        switch(t){
            case "READY":{
                this.client.gateway.session_id = d.session_id;
                break;}
            case "GUILD_CREATE":{
                this.client.guilds.add(d);
                for(const member of d.members){
                    this.client.users.add(member.user)
                }
                for(const presence of d.presences){
                    this.client.presences.add(presence)
                }
                break;}
            case "GUILD_UPDATE":{
                this.client.guilds.update(d);
                break;}
            case "GUILD_DELETE":{
                this.client.guilds.remove(d);
                break;}
            case "GUILD_ROLE_CREATE":{
                this.client.guild(d.guild_id).roles.add(d.role);
                break;}
            case "GUILD_ROLE_UPDATE":{
                this.client.guild(d.guild_id).roles.update(d.role);
                break;}
            case "GUILD_ROLE_DELETE":{
                this.client.guild(d.guild_id).roles.remove({id: d.role_id});
                break;}
            case "GUILD_MEMBER_ADD":{
                const guild = this.client.guild(d.guild_id);
                const guildRoles = {foo: guild.roles};
                guild.members.add({guildRoles, ...d});
                this.client.users.update(d.user);
                break;}
            case "GUILD_MEMBER_UPDATE":{
                const guild = this.client.guild(d.guild_id);
                const guildRoles = {foo: guild.roles};
                guild.members.update({guildRoles, ...d});
                this.client.users.update(d.user);
                break;}
            case "GUILD_MEMBER_REMOVE":{
                this.client.guild(d.guild_id).members.remove(d.user);
                this.client.users.remove(d.user);
                break;}
            case "PRESENCE_UPDATE":{
                this.client.guild(d.guild_id).presences.update(d);
                this.client.presences.update(d);
                break;}
            // case "INTERACTION_CREATE":{
            //     this.client.commandHandler.executeCheck(d);
            //     break;}
            default:{
                break;}
        }
    }

}