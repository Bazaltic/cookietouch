import Account from "@/account";
import BidAPI from "@/scripts/api/BidAPI";
import CharacterAPI from "@/scripts/api/CharacterAPI";
import CraftAPI from "@/scripts/api/CraftAPI";
import ExchangeAPI from "@/scripts/api/ExchangeAPI";
import FightAPI from "@/scripts/api/FightAPI";
import GatherAPI from "@/scripts/api/GatherAPI";
import InventoryAPI from "@/scripts/api/InventoryAPI";
import JobsAPI from "@/scripts/api/JobsAPI";
import MapAPI from "@/scripts/api/MapAPI";
import MountAPI from "@/scripts/api/MountAPI";
import NpcAPI from "@/scripts/api/NpcAPI";
import StorageAPI from "@/scripts/api/StorageAPI";
import DataAPI from "./DataAPI";
import MerchantsAPI from "./MerchantsAPI";
import QuestsAPI from "./QuestsAPI";

export default class API {
  public bid: BidAPI;
  public character: CharacterAPI;
  public exchange: ExchangeAPI;
  public fight: FightAPI;
  public gather: GatherAPI;
  public inventory: InventoryAPI;
  public jobs: JobsAPI;
  public map: MapAPI;
  public mount: MountAPI;
  public npc: NpcAPI;
  public storage: StorageAPI;
  public craft: CraftAPI;
  public quests: QuestsAPI;
  public merchants: MerchantsAPI;
  public data: DataAPI;

  constructor(account: Account) {
    this.bid = new BidAPI(account);
    this.character = new CharacterAPI(account);
    this.exchange = new ExchangeAPI(account);
    this.fight = new FightAPI(account);
    this.gather = new GatherAPI(account);
    this.inventory = new InventoryAPI(account);
    this.jobs = new JobsAPI(account);
    this.map = new MapAPI(account);
    this.mount = new MountAPI(account);
    this.npc = new NpcAPI(account);
    this.storage = new StorageAPI(account);
    this.craft = new CraftAPI(account);
    this.quests = new QuestsAPI(account);
    this.merchants = new MerchantsAPI(account);
    this.data = new DataAPI(account);
  }
}
