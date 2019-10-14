import { ActionCreator } from "redux";
import { FetchApi } from "../../services";
import { IPhotoItemProps } from "../../components/page-home/photos-list/photo-item";

export const PHOTOS_ACTIONS = {
  PHOTOS_LIST_ERROR: "PHOTOS_LIST_ERROR",
  PHOTOS_LIST_CACHED: "PHOTOS_ACTIONS.PHOTOS_LIST_CACHED",
  PHOTOS_LIST_SUCCESS: "PHOTOS_LIST_SUCCESS",
  PHOTOS_LIST_REQUSTED: "PHOTOS_LIST_REQUSTED",
  UPDATE_PHOTOS_LIST_AUTHOR_FILTER: "UPDATE_PHOTOS_LIST_AUTHOR_FILTER"
};

export interface IPhotosActionsProps {
  type: string;
  offset?: number;
  message?: string;
  authorFilter?: string;
  data?: Array<any>;
}

export const getPhotosList: ActionCreator<Function> = (
  offset: number = 0,
  authorFilter: string = ""
) => (dispatch: any) => {
  dispatch(requestPhotosList());

  FetchApi.get(
    `/api/photos?limit=2&skip=${offset}${
      authorFilter ? `&authorId=${authorFilter}` : ""
    }`
  ).subscribe((data: any) => {
    if (data.error) {
      dispatch(photosListError(data.error));
    } else {
      const { result } = data;

      if (result) {
        dispatch(savePhotosList(result, offset, authorFilter));
      } else {
        dispatch(photosListError("Error occured"));
      }
    }
  });
};

export const saveCachedPhotosList: ActionCreator<IPhotosActionsProps> = (
  data: Array<IPhotoItemProps>
) => savePhotosList(data);

export const updatePhotosListAuthorFilter: ActionCreator<IPhotosActionsProps> = (authorFilter: string) => ({
  type: PHOTOS_ACTIONS.UPDATE_PHOTOS_LIST_AUTHOR_FILTER,
  authorFilter
});

function requestPhotosList() {
  return {
    type: PHOTOS_ACTIONS.PHOTOS_LIST_REQUSTED
  };
}

function photosListError(message: string) {
  return {
    type: PHOTOS_ACTIONS.PHOTOS_LIST_ERROR,
    message
  };
}

function savePhotosList(
  data: Array<IPhotoItemProps>,
  offset?: number,
  authorFilter?: string
) {
  return {
    type: PHOTOS_ACTIONS.PHOTOS_LIST_SUCCESS,
    data,
    offset,
    authorFilter
  };
}