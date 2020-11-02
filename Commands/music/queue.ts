import { Message, MessageEmbed } from "discord.js";
import { re } from "mathjs";
import { embed_colors } from "../../settings";
import { CustomClient } from "../../types";
import { error_callback, seconds_to_hms } from "../util";

module.exports = {
	name: "queue",
	description: "Lists the entire queue",
	usage: "",
	category: "music",
	aliases: ["q"],
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
			)} requested by ${queue.songs[0].requested_by.user.tag}\` \n`
		);
		let up_next_songs = queue.songs.slice(1, queue.songs.length);
		let up_next_text = "";
		up_next_songs.forEach((song, i) => {
			up_next_text += `${i + 1}] ${song.title} |\` ${seconds_to_hms(
				song.duration
			)} requested by ${song.requested_by.user.tag}\` \n`;
		});
		response.addField(
			"Up Next:",
			!up_next_text ? "No upcoming songs" : up_next_text
		);
		message.channel.send(response);
		return;
	} else {
		let response = new MessageEmbed();
		response.setColor(embed_colors.info);
		response.setTitle("Nothing here.");
		response.setDescription("The server queue is empty.");
		message.channel.send(response);
		return;
	}
};
