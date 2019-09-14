import { Reducer } from "react";
import { USER_ACTIONS, ISaveUserAction } from "../actions/users";

export interface IUserState {
  userData: object | null;
}

const defaultState: IUserState = {
  userData: null
};

export const user: Reducer<any, ISaveUserAction> = (state = defaultState, action) => {
  switch (action.type) {
    case USER_ACTIONS.SAVE_USER:
      return Object.assign({}, state, {
        userData: action.userData
      })

    default:
      return state;
  }
};
