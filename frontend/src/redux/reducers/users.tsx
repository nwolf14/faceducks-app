import { Reducer } from "react";
import { USER_ACTIONS, IUserAction } from "../actions/users";
import { IUserData } from "../../interfaces";
import { userDataMapper } from "../../lib/data-mappers";

export interface IUserState {
  userData: IUserData | null;
}

const defaultState: IUserState = {
  userData: null
};

export const user: Reducer<any, IUserAction> = (state = defaultState, action) => {
  switch (action.type) {
    case USER_ACTIONS.GET_USER:
      return Object.assign({}, state, {
        userData: userDataMapper(action.userData)
      })
    case USER_ACTIONS.LOGOUT_USER:
      return Object.assign({}, state, {
        userData: null
      })

    default:
      return state;
  }
};
