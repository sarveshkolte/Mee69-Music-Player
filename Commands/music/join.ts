import { Message, MessageEmbed } from "discord.js";
import { i, re } from "mathjs";
import { embed_colors } from "../../settings";
import { CustomClient, Queue } from "../../types";
import { error_callback } from "../util";

module.exports = {
	name: "join",
	description: "joins user's voice channel",
	usage: "",
	category: "music",
	aliases: [],
};

module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	let response = new MessageEmbed();
	if (message.channel.type == "text") {
		if (message.member?.voice.channel) {
			let connection = await message.member.voice.channel.join();
			let queue = bot.global_queue.get(message.guild!.id);
			if (queue) {
				queue.connection = connection;
			} else {
				queue = new Queue(
					message.guild!.id,
					message.member.voice.channel,
					message.channel,
					connection,
					bot
				);
			}
			await bot.global_queue.set(message.guild!.id, queue);
			response = new MessageEmbed();
			response.setColor(embed_colors.success);
			response.setTitle("Successfully joined member's voice channel.");
		} else {
			response = error_callback("Cannot join voice channel", {
				reason: "User is not in a voice channel.",
			});
		}
	}
	message.channel.send(response);
	return;
};
