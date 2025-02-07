import { utils, Indexed } from "../utils/utils";
import EventBus from "./EventBus";

export enum StoreEvents {
  Updated = "updated",
}

class Store extends EventBus {
  private state: Indexed = {};

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    utils.set(this.state, path, value);
  }
}

export default new Store();
