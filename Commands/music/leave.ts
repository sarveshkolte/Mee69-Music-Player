import { Message, MessageEmbed } from "discord.js";
import { embed_colors } from "../../settings";
import { CustomClient } from "../../types";
import { error_callback } from "../util";

module.exports = {
	name: "leave",
	description: "leave user's voice channel",
	usage: "",
	category: "music",
	aliases: [],
};

module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	if (message.member?.voice.channel) {
		if (message.guild?.voice?.channel == message.member.voice.channel) {
			let queue = bot.global_queue.get(message.guild!.id);
			if (queue) bot.global_queue.delete(message.guild!.id);
			await message.guild.me?.voice.channel?.leave();

			let response = new MessageEmbed();
			response.setColor(embed_colors.success);
			response.setTitle("Successfully left user's channel");
			message.channel.send(response);
			return;
		} else {
			let response = error_callback("Cannot leave the channel", {
				reason: "You must be in the same voice channel as the bot",
			});
			message.channel.send(response);
			return;
		}
	} else {
		let response = error_callback("Cannot leave the channel", {
			reason: "You must be in a voice channel to use that command.",
		});
		message.channel.send(response);
		return;
	}
};
