import { ActionCreator } from "redux";

export const USER_ACTIONS = {
  SAVE_USER: 'SAVE_USER'
};

export interface ISaveUserAction {
  type: string;
  userData: object;
}

export const saveUser: ActionCreator<ISaveUserAction> = (userData: object) => {
  return {
    type: USER_ACTIONS.SAVE_USER,
    userData
  }
}
