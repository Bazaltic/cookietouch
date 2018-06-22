import ActorRestrictionsInformations from "@/protocol/network/types/ActorRestrictionsInformations";
import Message from "@/protocol/network/messages/Message";

export default class SetCharacterRestrictionsMessage extends Message {
  public restrictions: ActorRestrictionsInformations;

  constructor(restrictions: ActorRestrictionsInformations) {
    super();
    this.restrictions = restrictions;

  }
}
