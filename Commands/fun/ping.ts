import { GuildMember, Message, MessageEmbed, Util } from "discord.js";
import { Command, CustomClient } from "../../types";
import { error_callback } from "../util";
import { embed_colors } from "../../settings";

module.exports = {
	name: "ping",
	description: "API and Latecy Ping",
	usage: "",
	aliases: [],
};

module.exports.execute = (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): void => {
	let bot_latency = `**Discord latency**: ${Math.round(bot.ws.ping)}ms`;

	const response = new MessageEmbed();
	response.setTitle("Ping");
	response.setDescription(bot_latency);
	response.setColor(embed_colors.info);
	message.channel.send(response);
	return;
};
