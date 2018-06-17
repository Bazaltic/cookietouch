import Message from "./Message";

export default class AllianceInvitationStateRecruterMessage extends Message {
  public recrutedName: string;
  public invitationState: number;

  constructor(recrutedName = "", invitationState = 0) {
    super();
    this.recrutedName = recrutedName;
    this.invitationState = invitationState;

  }
}
