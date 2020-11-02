import Collection from "@discordjs/collection";
import {
	Client,
	GuildMember,
	Message,
	MessageEmbed,
	StreamDispatcher,
	TextChannel,
	VoiceChannel,
	VoiceConnection,
} from "discord.js";
import ytdl from "ytdl-core";
import { Url } from "url";
import { Readable } from "stream";
import { re } from "mathjs";
import { embed_colors } from "./settings";

export interface Command {
	name: string;
	description: string;
	category: string;
	usage: string;
	aliases: Array<string>;
	ignore?: boolean;
	execute: (
		message: Message,
		args: Array<string>,
		bot: Client
	) => void | Promise<void>;
}

export class Song {
	public title: string = "";

	public requested_by: GuildMember;
	public duration: number = 0;
	public youtube_link: string;
	public thumbnail?: string;
	constructor(youtube_link: string, requested_by: GuildMember) {
		this.requested_by = requested_by;
		this.youtube_link = youtube_link;
	}
	async validate(): Promise<boolean> {
		let isValid = await ytdl.validateURL(this.youtube_link);
		if (isValid) {
			let video_info = await ytdl.getInfo(this.youtube_link);
			this.duration = +video_info.player_response.videoDetails.lengthSeconds;
			this.title = video_info.player_response.videoDetails.title;
			if (video_info.player_response.videoDetails.thumbnail.thumbnails[0])
				this.thumbnail =
					video_info.player_response.videoDetails.thumbnail.thumbnails[0].url;
		}
		return isValid;
	}
}

export class Queue {
	public songs: Array<Song> = [];
	public queue_duration: number = 0;
	public server_id: string;
	public voice_channel: VoiceChannel;
	public text_channel: TextChannel;
	public connection: VoiceConnection | null = null;
	public dispatcher: StreamDispatcher | undefined | null;
	private client: CustomClient;

	constructor(
		server_id: string,
		voice_channel: VoiceChannel,
		text_channel: TextChannel,
		connection: VoiceConnection,
		client: CustomClient
	) {
		this.server_id = server_id;
		this.voice_channel = voice_channel;
		this.text_channel = text_channel;
		this.connection = connection;
		this.client = client;
	}

	play(song?: Song): void {
		let song_stream: Readable;
		if (song) {
			this.songs.push(song);
			if (this.songs.length - 1 > 0) {
				let song_added_embed = new MessageEmbed();
				let avatar_url = song.requested_by.user.avatarURL();
				song_added_embed.setColor(embed_colors.info);
				song_added_embed.setTitle("Added the the queue");
				song_added_embed.setDescription(song.title);
				song_added_embed.setFooter(
					`Requested by ${song.requested_by.user.tag}`,
					avatar_url ? avatar_url : ""
				);
				this.notify(song_added_embed);
			}
		}
		if (this.dispatcher) return;
		if (this.songs[0]) {
			song_stream = ytdl(this.songs[0].youtube_link);
			let song_change_embed = new MessageEmbed();
			let avatar_url = this.songs[0].requested_by.user.avatarURL();
			song_change_embed.setColor(embed_colors.info);
			song_change_embed.setTitle("Now playing");
			song_change_embed.setDescription(this.songs[0].title);
			song_change_embed.setFooter(
				`Requested by ${this.songs[0].requested_by.user.tag}`,
				avatar_url ? avatar_url : ""
			);
			if (this.songs[0].thumbnail)
				song_change_embed.setThumbnail(this.songs[0].thumbnail);
			this.notify(song_change_embed);
			this.dispatcher = this.connection!.play(song_stream);

			this.dispatcher!.on("finish", (): void => {
				console.log("Song end");
				this.dispatcher = null;
				this.songs.shift();
				this.play();
				return;
			});
		} else {
			this.dispatcher = null;
			let response = new MessageEmbed();
			response.setColor(embed_colors.info);
			response.setTitle("Finished playing");
			response.setDescription("Completed playing all the songs");
			this.notify(response);
			this.voice_channel.leave();
		}
	}
	pause(): void {
		if (this.dispatcher) {
			this.dispatcher.pause();
			let response = new MessageEmbed({
				color: embed_colors.info,
				title: "Paused current song.",
				description: `Paused playing ${this.songs[0].title}`,
			});
			this.notify(response);
		}
	}
	resume(): void {
		if (this.dispatcher) {
			if (this.dispatcher.paused) {
				this.dispatcher.resume();
				let response = new MessageEmbed({
					color: embed_colors.info,
					title: "Resumed current song.",
					description: `Resumed playing ${this.songs[0].title}`,
				});
				this.notify(response);
			}
		}
	}

	skip(): void {
		if (this.dispatcher) {
			this.dispatcher = null;
			this.songs.shift();
			let response = new MessageEmbed();
			response.setColor(embed_colors.info);
			response.setTitle("Skipped.");
			this.notify(response);
			this.play();
		}
	}
	setVolume(volume: number): void {
		if (this.dispatcher) {
			this.dispatcher.setVolume(volume);
			let response = new MessageEmbed();
			response.setColor(embed_colors.info);
			response.setTitle("Volume Changed");
			response.setDescription(`Current Volume is ${volume}`);
			this.notify(response);
		}
	}
	async notify(response: MessageEmbed) {
		await this.text_channel.send(response);
	}
}

export class CustomClient extends Client {
	public commands: Collection<string, Command> = new Collection();
	public global_queue: Collection<string, Queue> = new Collection();
	constructor() {
		super();
	}
}
