import type { Client } from "../client.ts";

class EventHandler{

    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }
    
    async handleDispatch(payload: any){
        const {t, d} = payload;
    
        switch(t){
            case "READY":
                // this.client.botUser = d.user;
                this.client.gateway.session_id = d.session_id;
                break;
            case "GUILD_CREATE":
                this.client.guilds.add(d);
                for(const member of d.members){
                    this.client.users.add(member.user)
                }
                for(const presence of d.presences){
                    this.client.users.update(presence)
                }
                break;
            case "GUILD_UPDATE":
                this.client.guilds.update(d);
                break;
            case "GUILD_DELETE":
                this.client.guilds.remove(d);
                break;
            case "GUILD_ROLE_CREATE":
                this.client.guild(d.guild_id).roles.add(d.role);
                break;
            case "GUILD_ROLE_UPDATE":
                this.client.guild(d.guild_id).roles.update(d.role);
                break;
            case "GUILD_ROLE_DELETE":
                this.client.guild(d.guild_id).roles.remove({id: d.role_id});
                break;
            case "GUILD_MEMBER_ADD":
                this.client.guild(d.guild_id).addMember(d);
                break;
            case "GUILD_MEMBER_UPDATE":
                this.client.guild(d.guild_id).updateMember(d);
                break;
            case "GUILD_MEMBER_REMOVE":
                this.client.guild(d.guild_id).removeMember(d.user.id);
                break;
            case "PRESENCE_UPDATE":
                this.client.guild(d.guild_id).updateMember(d);
                this.client.users.update(d);
                break;
            // case "INTERACTION_CREATE":{
            //     this.client.commandHandler.executeCheck(d);
            //     break;}
            default:{
                break;}
        }
    }

}

export { EventHandler }