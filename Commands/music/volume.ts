import { Message, MessageEmbed } from "discord.js";
import { embed_colors } from "../../settings";
import { CustomClient } from "../../types";
import { error_callback } from "../util";

module.exports = {
	name: "volume",
	description: "resumes the current song",
	usage: "",
	category: "music",
	aliases: ["vol"],
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
				let response = error_callback("Cannot change bot volume", {
					reason: "The bot must be playing to be able to change its volume",
				});
				message.channel.send(response);
				return;
			}
			if (!args[0]) {
				let response = error_callback("Cannot change bot volume", {
					reason: "Please provide volume level to be able to change it.",
				});
				message.channel.send(response);
				return;
			}
			queue.setVolume(Number(args[0]));
			return;
		} else {
			let response = error_callback("Cannot change bot volume", {
				reason: "You must be in the same voice channel as the bot",
			});
			message.channel.send(response);
			return;
		}
	} else {
		let response = error_callback("Cannot change bot volume", {
			reason: "You must be in a voice channel to use that command.",
		});
		message.channel.send(response);
		return;
	}
};
