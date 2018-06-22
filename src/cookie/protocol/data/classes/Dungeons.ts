import Data from "@/protocol/data/Data";

export default class Dungeons extends Data {
  public nameId: string;
  public optimalPlayerLevel: number;
  public mapIds: number[];
  public entranceMapId: number;
  public exitMapId: number;
}
