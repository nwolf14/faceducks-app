import { ActionCreator } from "redux";

export const PHOTOS_ACTIONS = {
  PHOTOS_LIST_ERROR: "PHOTOS_LIST_ERROR",
  PHOTOS_LIST_CACHED: "PHOTOS_ACTIONS.PHOTOS_LIST_CACHED",
  PHOTOS_LIST_SUCCESS: "PHOTOS_LIST_SUCCESS",
  PHOTOS_LIST_REQUSTED: "PHOTOS_LIST_REQUSTED",
  USER_QUERY_UPDATED: "USER_QUERY_UPDATED"
};

export interface IPhotosActionsProps {
  type: string;
  skipped?: number;
  message?: string;
  userQuery?: string;
  data?: Array<any>;
}

export const requestPhotosList: ActionCreator<IPhotosActionsProps> = () => ({
  type: PHOTOS_ACTIONS.PHOTOS_LIST_REQUSTED
});
export const photosListError: ActionCreator<IPhotosActionsProps> = (
  message: string
) => ({
  type: PHOTOS_ACTIONS.PHOTOS_LIST_ERROR,
  message
});
export const photosListCached: ActionCreator<IPhotosActionsProps> = () => ({
  type: PHOTOS_ACTIONS.PHOTOS_LIST_CACHED
});
export const photosListSuccess: ActionCreator<IPhotosActionsProps> = (
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
