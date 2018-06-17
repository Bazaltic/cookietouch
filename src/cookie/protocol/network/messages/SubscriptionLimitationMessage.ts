import Message from "./Message";

export default class SubscriptionLimitationMessage extends Message {
  public reason: number;

  constructor(reason = 0) {
    super();
    this.reason = reason;

  }
}
