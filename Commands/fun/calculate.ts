import { Message, MessageEmbed, Util } from "discord.js";
import { Command, CustomClient } from "../../types";
import * as math from "mathjs";
import { error_callback } from "../util";
import { embed_colors } from "../../settings";

module.exports = {
	name: "calculate",
	description: "solves a mathematical expression",
	usage: "[mathematical expression]",
	aliases: ["calc", "cal"],
};

module.exports.execute = (
	message: Message,
	args: Array<string>,
	bot: CustomClient
): void => {
	let expression = args.join(" ");

	let response = new MessageEmbed();
	let answer;
	try {
		answer = math.evaluate(expression);
		response.setColor(embed_colors.success);
		response.setTitle(`The answer of \`${expression}\` is`);
		response.setDescription(`${answer}`);
	} catch {
		response = error_callback("Failed to calculate", {
			reason:
				"Please make sure you are entering a valid mathematical expression",
		});
	} finally {
		message.channel.send(response);
	}
};
