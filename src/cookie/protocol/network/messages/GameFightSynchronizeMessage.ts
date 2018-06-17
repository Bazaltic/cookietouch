import GameFightFighterInformations from "@protocol/network/types/GameFightFighterInformations";
import Message from "./Message";

export default class GameFightSynchronizeMessage extends Message {
  public fighters: GameFightFighterInformations[];

  constructor(fighters: GameFightFighterInformations[]) {
    super();
    this.fighters = fighters;

  }
}
