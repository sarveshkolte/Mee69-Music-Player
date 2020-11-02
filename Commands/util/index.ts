import { MessageEmbed } from "discord.js";
import { embed_colors } from "../../settings";

export function error_callback(
	action: string,
	options?: { reason?: string; suggest?: string }
): MessageEmbed {
	let error_embed = new MessageEmbed();
	error_embed.setColor(embed_colors.error);
	error_embed.setTitle(`${action}`);

	if (options && options.reason) {
		error_embed.setDescription(options.reason);
	}
	if (options && options.suggest) {
		error_embed.setDescription(options.suggest);
	}
	return error_embed;
}
export function seconds_to_hms(d: number) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor((d % 3600) / 60);
	var s = Math.floor((d % 3600) % 60);

	var hDisplay = h > 0 ? h + (h == 1 ? ": " : ":") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
	return hDisplay + mDisplay + sDisplay;
}
export function get_user_id_from_mention(mention: string) {
	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);

		if (mention.startsWith("!")) {
			mention = mention.slice(1);
		}
	}
	return mention;
}
