import StartupActionAddObject from "@/protocol/network/types/StartupActionAddObject";
import Message from "@/protocol/network/messages/Message";

export default class StartupActionsListMessage extends Message {
  public actions: StartupActionAddObject[];

  constructor(actions: StartupActionAddObject[]) {
    super();
    this.actions = actions;

  }
}
