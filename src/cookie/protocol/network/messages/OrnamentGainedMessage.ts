import Message from "@/protocol/network/messages/Message";

export default class OrnamentGainedMessage extends Message {
  public ornamentId: number;

  constructor(ornamentId = 0) {
    super();
    this.ornamentId = ornamentId;
  }
}
