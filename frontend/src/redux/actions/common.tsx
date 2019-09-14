import { ActionCreator } from "redux";

export const COMMON_ACTIONS = {
  OFFLINE: 'OFFLINE'
};

export interface IAppOfflineStateAction {
  type: string;
  offline: boolean;
}

export const setOfflineStatus: ActionCreator<IAppOfflineStateAction> = (offline: boolean) => {
  return {
    type: COMMON_ACTIONS.OFFLINE,
    offline
  }
}
