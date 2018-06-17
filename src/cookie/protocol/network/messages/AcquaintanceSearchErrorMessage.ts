import Message from "./Message";

export default class AcquaintanceSearchErrorMessage extends Message {
  public reason: number;

  constructor(reason = 0) {
    super();
    this.reason = reason;

  }
}
