import { GuildMember, Message, MessageEmbed, Util } from "discord.js";
import { Command, CustomClient } from "../../types";
import { error_callback } from "../util";
import { embed_colors } from "../../settings";

module.exports = {
	name: "kick",
	description: "kicks a member from the server",
	usage: "[member] [optional-reason]",
	aliases: [],
};

module.exports.execute = (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): void => {
	if (!message.member?.hasPermission(["KICK_MEMBERS"])) {
		let response = error_callback("Cannot kick the member", {
			reason: "You do not have enough permissions",
		});
		message.channel.send(response);
		return;
	}
	let kick_member_mention = message.mentions.users.first();
	let reason = args.join(" ");
	let kick_member: GuildMember | null | undefined;
	if (kick_member_mention) {
		kick_member = message.guild?.member(kick_member_mention);
	} else {
		message.channel.send(
			error_callback("Cannot kick the member", {
				suggest: "Please mention the user in order to kick them!",
			})
		);
		return;
	}
	if (kick_member) {
		if (kick_member.kickable) {
			let private_response = new MessageEmbed();
			private_response.setColor(embed_colors.error);
			private_response.setTitle(
				`You have been kicked from \`${message.guild!.name}\``
			);
			if (reason) private_response.setDescription(`**reason**: ${reason}`);

			kick_member.user.send(private_response).catch((reason) => {
				console.log("Could not DM the user");
			});

			kick_member.kick();
			let response = new MessageEmbed();
			response.setColor(embed_colors.error);
			response.setTitle(`User has been kicked from the server.`);
			if (reason) response.setDescription(`**reason**: ${reason}`);
			message.channel.send(response);
			return;
		} else {
			let response = error_callback("Could not kick member", {
				reason: "The user probably has a higher role or is an admin.",
			});
			message.channel.send(response);
			return;
		}
	} else {
		message.channel.send(
			error_callback("Cannot kick the member", {
				reason: "No such member exists in this server.",
			})
		);
		return;
	}
};
