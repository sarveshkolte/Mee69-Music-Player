import { Message, MessageEmbed } from "discord.js";
import { CustomClient, Queue, Song } from "../../types";
import { StringUtils } from "turbocommons-ts";
import ytdl from "ytdl-core";
import { error_callback } from "../util";
import yts from "yt-search";

const join: (
	message: Message,
	args: Array<string>,
	bot: CustomClient
) => Promise<void> = require("./join").execute;

module.exports = {
	name: "play",
	description: "plays music in voice channel",
	usage: "[link or song title]",
	category: "music",
	aliases: ["p"],
};
module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	let song_url: string = "";
	if (StringUtils.isUrl(args[0])) {
		song_url = args[0];
	} else {
		message.channel.send("Searching...");
		let results = await yts(args.join(" "));

		let video = results.videos[0];
		if (video.url) song_url = video.url;
	}
	let queue = bot.global_queue.get(message.guild!.id);
	if (!message.guild?.voice || !queue) {
		await join(message, args, bot);
	}
	queue = bot.global_queue.get(message.guild!.id);
	let song = new Song(song_url, message.member!);

	let is_Valid = await song.validate();
	if (!is_Valid) {
		let response = error_callback("Couldn't play song", {
			reason: "The provided link is not valid",
		});
		message.channel.send(response);
		return;
	}
	await queue!.play(song);

	return;
};
