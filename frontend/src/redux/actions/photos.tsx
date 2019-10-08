import { ActionCreator } from "redux";
import { FetchApi } from "../../services";
import { clearAllData, writeData } from "../../lib/utility";

export const PHOTOS_ACTIONS = {
  PHOTOS_LIST_ERROR: "PHOTOS_LIST_ERROR",
  PHOTOS_LIST_CACHED: "PHOTOS_ACTIONS.PHOTOS_LIST_CACHED",
  PHOTOS_LIST_SUCCESS: "PHOTOS_LIST_SUCCESS",
  PHOTOS_LIST_REQUSTED: "PHOTOS_LIST_REQUSTED",
  USER_QUERY_UPDATED: "USER_QUERY_UPDATED"
};

export interface IPhotosActionsProps {
  type: string;
  offset?: number;
  message?: string;
  userQuery?: string;
  data?: Array<any>;
}

export const requestPhotosList: ActionCreator<Function> = (
  offset: number = 0
) => (dispatch: any) => {
  FetchApi.get(`/api/photos?limit=2&skip=${offset}`).subscribe((data: any) => {
    dispatch({
      type: PHOTOS_ACTIONS.PHOTOS_LIST_REQUSTED
    });

    if (data.error) {
      dispatch({
        type: PHOTOS_ACTIONS.PHOTOS_LIST_ERROR,
        message: data.error
      });
    } else {
      const { result } = data;

      if (result && result.length !== 0) {
        clearAllData("posts");
        result.forEach((item: any) => writeData("posts", item));

        dispatch({
          type: PHOTOS_ACTIONS.PHOTOS_LIST_SUCCESS,
          data: result,
          offset
        });
      } else {
        dispatch({
          type: PHOTOS_ACTIONS.PHOTOS_LIST_ERROR,
          message: 'Error occured'
        });
      }
    }
  });
};

export const saveCachedPhotosList: ActionCreator<IPhotosActionsProps> = (
  data: Array<any>
) => ({
  type: PHOTOS_ACTIONS.PHOTOS_LIST_SUCCESS,
  data
});

export const updateUserSearchQuery: ActionCreator<IPhotosActionsProps> = (
  userQuery: string
) => ({
  type: PHOTOS_ACTIONS.USER_QUERY_UPDATED,
  userQuery
});
