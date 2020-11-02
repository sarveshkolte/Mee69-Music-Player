import { Message } from "discord.js";
import { Command, CustomClient } from "./types";
import * as settings from "./settings";
import fs from "fs";

const bot = new CustomClient();

//Get All the commands from the command folder
settings.modules.forEach((module: string) => {
	fs.readdir(`./Commands/${module}`, (err, files) => {
		if (err) throw err;

		console.log(
			`[Command Logs] Loaded ${files.length} commands from ${module}`
		);

		files.forEach((file) => {
			const command: Command = require(`./Commands/${module}/${file}`);
			if (!command.ignore && command) {
				bot.commands.set(command.name, command);
				command.aliases.forEach((alias) => bot.commands.set(alias, command));
			}
		});
	});
});

bot.on("ready", () => {
	bot.user!.setActivity("with 69!");
	bot.voice?.connections.each((connection) => connection.disconnect());
	console.log(`Client with tag ${bot.user!.tag}`);
});

bot.on(
	"message",
	async (message: Message): Promise<void> => {
		if (message.author.bot) return;
		if (message.channel.type == "dm") return;

		let prefix = settings.default_prefx;

		if (!message.content.startsWith(prefix)) return;

		let args = message.content.split(" ");
		let cmd_name = args[0].slice(prefix.length);

		args = args.slice(1);

		let command = bot.commands.get(cmd_name);
		if (!command) return;

		command.execute(message, args, bot);
	}
);

bot.login(settings.token);
