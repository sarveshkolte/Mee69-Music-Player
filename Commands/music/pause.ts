import { Message, MessageEmbed } from "discord.js";
import { embed_colors } from "../../settings";
import { CustomClient } from "../../types";
import { error_callback } from "../util";

module.exports = {
	name: "pause",
	description: "Pauses the current song",
	usage: "",
	category: "music",
	aliases: ["stop"],
};

module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	if (message.member?.voice.channel) {
		if (message.guild?.voice?.channel == message.member.voice.channel) {
			let queue = bot.global_queue.get(message.guild!.id);
			if (!queue) {
				let response = error_callback("Cannot pause the song", {
					reason: "There is no song playing in the queue",
				});
				message.channel.send(response);
				return;
			}
			queue.pause();
			return;
		} else {
			let response = error_callback("Cannot pause the song", {
				reason: "You must be in the same voice channel as the bot",
			});
			message.channel.send(response);
			return;
		}
	} else {
		let response = error_callback("Cannot pause the song", {
			reason: "You must be in a voice channel to use that command.",
		});
		message.channel.send(response);
		return;
	}
};
