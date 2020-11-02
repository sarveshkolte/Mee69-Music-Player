import { GuildMember, Message, MessageEmbed, User, Util } from "discord.js";
import { Command, CustomClient } from "../../types";
import { error_callback, get_user_id_from_mention } from "../util";
import { embed_colors } from "../../settings";

module.exports = {
	name: "avatar",
	description: "shows avatar",
	usage: "(optional mention)",
	aliases: [],
};

module.exports.execute = async (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): Promise<void> => {
	let request_user: User = message.member!.user;
	if (args[0]) {
		let user_id = get_user_id_from_mention(args[0]);
		console.log(user_id);
		request_user = await bot.users.fetch(user_id);
		if (!request_user) {
			let response = error_callback("Couldn't get Avatar", {
				reason: "Invalid mention or user id",
			});
			message.channel.send(response);
			return;
		}
	}

	let avatar_url = request_user.avatarURL({ dynamic: true, size: 256 });

	let response = new MessageEmbed();
	response.setColor(embed_colors.info);
	response.setTitle(request_user.username);
	response.setImage(avatar_url!);

	message.channel.send(response);
	return;
};
