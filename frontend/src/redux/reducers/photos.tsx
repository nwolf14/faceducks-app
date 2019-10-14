import { Reducer } from "react";
import { PHOTOS_ACTIONS, IPhotosActionsProps } from "../actions/photos";
import { SKIP_PHOTOS_DOCUMENTS } from "../../lib/constants";

export interface IPhotosReducerState {
  photosList: Array<any>;
  isPhotosListLoading: boolean;
  photosListError: string;
  photosListAuthorFilter: string;
  photosListOffset: number;
  hasMorePhotos: boolean;
}

const defaultState: IPhotosReducerState = {
  photosList: [],
  isPhotosListLoading: false,
  photosListError: "",
  photosListAuthorFilter: "",
  photosListOffset: 0,
  hasMorePhotos: true
};

export const photos: Reducer<any, IPhotosActionsProps> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case PHOTOS_ACTIONS.PHOTOS_LIST_REQUSTED:
      return Object.assign({}, state, {
        photosListError: ""
      });
    case PHOTOS_ACTIONS.PHOTOS_LIST_ERROR:
      return Object.assign({}, state, {
        photosListError: action.message
      });
    case PHOTOS_ACTIONS.PHOTOS_LIST_SUCCESS:
      return Object.assign({}, state, {
        photosList: state.photosList.concat(action.data),
        photosListError: "",
        photosListAuthorFilter: action.authorFilter,
        photosListOffset:
          typeof action.offset === "number"
            ? action.offset + SKIP_PHOTOS_DOCUMENTS
            : state.photosListOffset,
        hasMorePhotos: action.data && action.data.length === 0 ? false : true
      });
    case PHOTOS_ACTIONS.UPDATE_PHOTOS_LIST_AUTHOR_FILTER:
      if (action.authorFilter !== state.photosListAuthorFilter) {
        return Object.assign({}, state, {
          photosList: [],
          photosListAuthorFilter: action.authorFilter,
          photosListOffset: 0
        });
      }
      return state;

    default:
      return state;
  }
};
