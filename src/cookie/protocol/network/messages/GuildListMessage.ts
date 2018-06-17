import GuildInformations from "@protocol/network/types/GuildInformations";
import Message from "./Message";

export default class GuildListMessage extends Message {
  public guilds: GuildInformations[];

  constructor(guilds: GuildInformations[]) {
    super();
    this.guilds = guilds;

  }
}
