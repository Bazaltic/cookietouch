import Account from "@/account";
import AveragePricesFrame from "@/frames/common/AveragePricesFrame";
import GoultinesFrame from "@/frames/common/GoultinesFrame";
import QueueFrame from "@/frames/common/QueueFrame";
import SecurityFrame from "@/frames/common/SecurityFrame";
import CharacterSelectionFrame from "@/frames/connection/CharacterSelectionFrame";
import IdentificationFrame from "@/frames/connection/IdentificationFrame";
import ServerSelectionFrame from "@/frames/connection/ServerSelectionFrame";
import AchievementsFrame from "@/frames/game/AchievementsFrames";
import BidFrame from "@/frames/game/BidFrame";
import CharacterFrame from "@/frames/game/CharacterFrame";
import ChatFrame from "@/frames/game/ChatFrame";
import ExchangeFrame from "@/frames/game/ExchangeFrame";
import FightFrame from "@/frames/game/FightFrame";
import InventoryFrame from "@/frames/game/InventoryFrame";
import MapFrame from "@/frames/game/MapFrame";
import NpcsFrame from "@/frames/game/NpcsFrame";
import QuestsFrame from "@/frames/game/QuestsFrame";
import StorageFrame from "@/frames/game/StorageFrame";

export default class Frames {
  private chat: ChatFrame;
  private queue: QueueFrame;
  private security: SecurityFrame;
  private characterSelection: CharacterSelectionFrame;
  private identification: IdentificationFrame;
  private serverSelection: ServerSelectionFrame;
  private map: MapFrame;
  private character: CharacterFrame;
  private inventory: InventoryFrame;
  private achievements: AchievementsFrame;
  private bid: BidFrame;
  private exchange: ExchangeFrame;
  private npcs: NpcsFrame;
  private quests: QuestsFrame;
  private storage: StorageFrame;
  private fight: FightFrame;
  private averagePrices: AveragePricesFrame;
  private goultines: GoultinesFrame;

  constructor(account: Account) {
    this.achievements = new AchievementsFrame(account);
    this.bid = new BidFrame(account);
    this.chat = new ChatFrame(account);
    this.queue = new QueueFrame(account);
    this.security = new SecurityFrame(account);
    this.characterSelection = new CharacterSelectionFrame(account);
    this.identification = new IdentificationFrame(account);
    this.serverSelection = new ServerSelectionFrame(account);
    this.character = new CharacterFrame(account);
    this.map = new MapFrame(account);
    this.inventory = new InventoryFrame(account);
    this.exchange = new ExchangeFrame(account);
    this.npcs = new NpcsFrame(account);
    this.quests = new QuestsFrame(account);
    this.storage = new StorageFrame(account);
    this.fight = new FightFrame(account);
    this.averagePrices = new AveragePricesFrame(account);
    this.goultines = new GoultinesFrame(account);
  }
}
