import { Reducer } from "react";
import { COMMON_ACTIONS, IAppOfflineStateAction } from "../actions/common";

export interface ICommonState {
  offline: boolean;
}

const defaultState: ICommonState = {
  offline: false
};

export const common: Reducer<any, IAppOfflineStateAction> = (state = defaultState, action) => {
  switch (action.type) {
    case COMMON_ACTIONS.OFFLINE:
      return Object.assign({}, state, {
        offline: action.offline
      })

    default:
      return state;
  }
};
