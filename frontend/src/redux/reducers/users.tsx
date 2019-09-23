import { Reducer } from "react";
import { USER_ACTIONS, IGetUserAction } from "../actions/users";

export interface IUserState {
  userData: object | null;
}

const defaultState: IUserState = {
  userData: null
};

export const user: Reducer<any, IGetUserAction> = (state = defaultState, action) => {
  switch (action.type) {
    case USER_ACTIONS.GET_USER:
      return Object.assign({}, state, {
        userData: action.userData
      })

    default:
      return state;
  }
};
