import Message from "./Message";

export default class AllianceInvitationAnswerMessage extends Message {
  public accept: boolean;

  constructor(accept = false) {
    super();
    this.accept = accept;

  }
}
