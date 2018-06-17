import ObjectItem from "@protocol/network/types/ObjectItem";
import ExchangeObjectMessage from "./ExchangeObjectMessage";

export default class ExchangeObjectModifiedInBagMessage extends ExchangeObjectMessage {
  public objectPublic: ObjectItem;

  constructor(remote = false, object: ObjectItem) {
    super(remote);
    this.objectPublic = object;

  }
}
