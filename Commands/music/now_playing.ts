import { Message, MessageEmbed } from "discord.js";
import { embed_colors } from "../../settings";
import { CustomClient } from "../../types";
import { error_callback, seconds_to_hms } from "../util";

module.exports = {
	name: "np",
	description: "Shows the currently playing song",
	usage: "",
	category: "music",
	aliases: ["np"],
};

module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	let queue = bot.global_queue.get(message.guild!.id);
	if (queue) {
		let response = new MessageEmbed();
		response.setColor(embed_colors.info);
		response.addField(
			"Now Playing:",
			`${queue.songs[0].title} |\` ${seconds_to_hms(
				queue.songs[0].duration
			)} requested by ${queue.songs[0].requested_by}\``
		);

		message.channel.send(response);
		return;
	}
	if (!queue || queue!.songs[0]) {
		let response = new MessageEmbed();
		response.setColor(embed_colors.info);
		response.setTitle("Nothing here.");
		response.setDescription("The server queue is empty.");
		message.channel.send(response);
		return;
	}
};
