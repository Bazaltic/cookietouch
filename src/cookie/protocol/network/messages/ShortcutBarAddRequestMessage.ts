import Shortcut from "@protocol/network/types/Shortcut";
import Message from "./Message";

export default class ShortcutBarAddRequestMessage extends Message {
  public barType: number;
  public shortcut: Shortcut;

  constructor(barType = 0, shortcut: Shortcut) {
    super();
    this.barType = barType;
    this.shortcut = shortcut;

  }
}
