import { ActionCreator } from "redux";
import { FetchApi } from "../../services";

export const USER_ACTIONS = {
  GET_USER: "GET_USER"
};

export interface IGetUserAction {
  type: string;
  userData: object;
}

export const getUser: ActionCreator<Function> = (token: string) => (
  dispatch: any
) => {
  FetchApi.get("/api/users/current", token).subscribe((data: any) => {
    if (!data || data.errors) return;

    dispatch({
      type: USER_ACTIONS.GET_USER,
      userData: data
    });
  });
};
