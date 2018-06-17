import GuildEmblem from "./GuildEmblem";
import GuildInformations from "./GuildInformations";

export default class GuildInAllianceInformations extends GuildInformations {
  public guildLevel: number;
  public nbMembers: number;
  public enabled: boolean;

  constructor(guildId = 0, guildName = "", guildEmblem: GuildEmblem = null,
              guildLevel = 0, nbMembers = 0, enabled = false) {
    super(guildId, guildName, guildEmblem);
    this.guildLevel = guildLevel;
    this.nbMembers = nbMembers;
    this.enabled = enabled;

  }
}
