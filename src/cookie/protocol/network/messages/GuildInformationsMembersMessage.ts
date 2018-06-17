import GuildMember from "@protocol/network/types/GuildMember";
import Message from "./Message";

export default class GuildInformationsMembersMessage extends Message {
  public members: GuildMember[];

  constructor(members: GuildMember[]) {
    super();
    this.members = members;

  }
}
