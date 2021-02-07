const {TOKEN, OPTIONS} = require("./secret");
const Wifu = require("../index");

const BOT = new Wifu(TOKEN, OPTIONS);

const COMMAND = new Wifu.Command({
    id: "command id",
	cooldown: 5000,
	syntax: {},
	execute: async function(p){
		p.reply("Hi!")
    }
});

BOT.addCommand(COMMAND);