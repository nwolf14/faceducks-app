import { ActionCreator } from "redux";
import { FetchApi } from "../../services";
import { ERROR_CODES } from "../../lib/constants";

export const USER_ACTIONS = {
  GET_USER: "GET_USER",
  LOGOUT_USER: "LOGOUT_USER"
};

export interface IUserAction {
  type: string;
  userData?: object;
}

export const getUser: ActionCreator<Function> = (token: string) => (
  dispatch: any
) => {
  FetchApi.get("/api/users/current", token).subscribe((data: any) => {
    if (!data || data.errors || ERROR_CODES.includes(data)) return;

    dispatch({
      type: USER_ACTIONS.GET_USER,
      userData: data
    });
  });
};

export const logoutUser: ActionCreator<IUserAction> = () => ({ type: USER_ACTIONS.LOGOUT_USER });
