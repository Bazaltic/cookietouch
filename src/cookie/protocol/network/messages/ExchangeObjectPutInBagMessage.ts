import ObjectItem from "@/protocol/network/types/ObjectItem";
import ExchangeObjectMessage from "@/protocol/network/messages/ExchangeObjectMessage";

export default class ExchangeObjectPutInBagMessage extends ExchangeObjectMessage {
  public objectPublic: ObjectItem;

  constructor(remote = false, object: ObjectItem) {
    super(remote);
    this.objectPublic = object;

  }
}
