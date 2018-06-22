import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import BuyItemAction from "@/scripts/actions/bid/BuyItemAction";
import EditItemInSalePriceAction from "@/scripts/actions/bid/EditItemInSalePriceAction";
import RemoveItemInSaleAction from "@/scripts/actions/bid/RemoveItemInSaleAction";
import SellItemAction from "@/scripts/actions/bid/SellItemAction";
import StartBuyingAction from "@/scripts/actions/bid/StartBuyingAction";
import StartSellingAction from "@/scripts/actions/bid/StartSellingAction";

export interface IObjectInSale {
  gid: number;
  uid: number;
  lot: number;
  price: number;
}

export default class BidAPI {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  public startBuying(): boolean {
    if (this.account.isBusy) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StartBuyingAction(),
      true
    );
    return true;
  }

  public async getItemPrice(gid: number, lot: number): Promise<number> {
    return this.account.game.bid.getItemPrice(gid, lot);
  }

  public buyItem(gid: number, lot: number): boolean {
    if (this.account.state !== AccountStates.BUYING) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new BuyItemAction(gid, lot),
      true
    );
    return true;
  }

  public startSelling(): boolean {
    if (this.account.isBusy) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StartSellingAction(),
      true
    );
    return true;
  }

  public get itemsInSaleCount(): number {
    return this.account.game.bid.objectsInSale
      ? this.account.game.bid.objectsInSale.Count()
      : 0;
  }

  public getItemsInSale(): IObjectInSale[] {
    // This will automatically handle the list being null
    if (this.account.state !== AccountStates.SELLING) {
      return [];
    }

    const tmp = this.account.game.bid.objectsInSale.Select(t => {
      return {
        gid: t.objectGID,
        lot: t.quantity,
        price: t.objectPrice,
        uid: t.objectUID
      } as IObjectInSale;
    });

    return tmp.ToArray();
  }

  public sellItem(gid: number, lot: number, price: number): boolean {
    if (this.account.state !== AccountStates.SELLING) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new SellItemAction(gid, lot, price),
      true
    );
    return true;
  }

  public removeItemInSale(uid: number): boolean {
    if (this.account.state !== AccountStates.SELLING) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new RemoveItemInSaleAction(uid),
      true
    );
    return true;
  }

  public editItemInSalePrice(uid: number, newPrice: number): boolean {
    if (this.account.state !== AccountStates.SELLING) {
      return false;
    }
    if (newPrice === 0) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new EditItemInSalePriceAction(uid, newPrice),
      true
    );
    return true;
  }
}
