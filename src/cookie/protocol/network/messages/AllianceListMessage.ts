import AllianceFactSheetInformations from "@/protocol/network/types/AllianceFactSheetInformations";
import Message from "@/protocol/network/messages/Message";

export default class AllianceListMessage extends Message {
  public alliances: AllianceFactSheetInformations[];

  constructor(alliances: AllianceFactSheetInformations[] = null) {
    super();
    this.alliances = alliances;

  }
}
