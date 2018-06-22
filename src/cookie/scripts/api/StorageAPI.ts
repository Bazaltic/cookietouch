import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import StorageGetAllItemsAction from "@/scripts/actions/storage/StorageGetAllItemsAction";
import StorageGetExistingItemsAction from "@/scripts/actions/storage/StorageGetExistingItemsAction";
import StorageGetItemAction from "@/scripts/actions/storage/StorageGetItemAction";
import StorageGetKamasAction from "@/scripts/actions/storage/StorageGetKamasAction";
import StoragePutAllItemsAction from "@/scripts/actions/storage/StoragePutAllItemsAction";
import StoragePutExistingItemsAction from "@/scripts/actions/storage/StoragePutExistingItemsAction";
import StoragePutItemAction from "@/scripts/actions/storage/StoragePutItemAction";
import StoragePutKamasAction from "@/scripts/actions/storage/StoragePutKamasAction";

export default class StorageAPI {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
  }

  public get kamas(): number {
    return this.account.game.storage.kamas;
  }

  public itemCount(gid: number): number {
    return this.account.game.storage.objects
      .Where(o => o.gid === gid)
      .Sum(o => o.quantity);
  }

  public putItem(gid: number, quantity: number): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    if (
      this.account.game.character.inventory
        .getObjectsByGid(gid)
        .Sum(o => o.quantity) === 0
    ) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StoragePutItemAction(gid, quantity),
      true
    );
    return true;
  }

  public getItem(gid: number, quantity: number): boolean {
    if (this.itemCount(gid) === 0) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StorageGetItemAction(gid, quantity),
      true
    );
    return true;
  }

  public putKamas(quantity: number): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StoragePutKamasAction(quantity),
      true
    );
    return true;
  }

  public getKamas(quantity: number): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StorageGetKamasAction(quantity),
      true
    );
    return true;
  }

  public putAllItems(): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StoragePutAllItemsAction(),
      true
    );
    return true;
  }

  public getAllItems(): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StorageGetAllItemsAction(),
      true
    );
    return true;
  }

  public putExistingItems(): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StoragePutExistingItemsAction(),
      true
    );
    return true;
  }

  public getExistingItems(): boolean {
    if (this.account.state !== AccountStates.STORAGE) {
      return false;
    }
    this.account.scripts.actionsManager.enqueueAction(
      new StorageGetExistingItemsAction(),
      true
    );
    return true;
  }
}
