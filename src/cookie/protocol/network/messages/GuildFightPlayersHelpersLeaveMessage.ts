import Message from "./Message";

export default class GuildFightPlayersHelpersLeaveMessage extends Message {
  public fightId: number;
  public playerId: number;

  constructor(fightId = 0, playerId = 0) {
    super();
    this.fightId = fightId;
    this.playerId = playerId;

  }
}
