import { Reducer } from "react";
import { PHOTOS_ACTIONS, IPhotosActionsProps } from "../actions/photos";
import { SKIP_PHOTOS_DOCUMENTS } from '../../lib/constants';

export interface IPhotosReducerState {
  photosList: Array<any>;
  isPhotosListLoading: boolean;
  photosListError: string;
  searchByUser: string;
  photosListOffset: number;
  hasMorePhotos: boolean;
}

const defaultState: IPhotosReducerState = {
  photosList: [],
  isPhotosListLoading: false,
  photosListError: "",
  searchByUser: "",
  photosListOffset: 0,
  hasMorePhotos: true
};

export const photos: Reducer<any, IPhotosActionsProps> = (state = defaultState, action) => {
  switch (action.type) {
    case PHOTOS_ACTIONS.PHOTOS_LIST_REQUSTED:
      return Object.assign({}, state, {
        isPhotosListLoading: true,
        photosListError: ''
      })
    case PHOTOS_ACTIONS.PHOTOS_LIST_ERROR:
      return Object.assign({}, state, {
        isPhotosListLoading: false,
        photosListError: action.message
      })
    case PHOTOS_ACTIONS.PHOTOS_LIST_CACHED:
      return Object.assign({}, state, {
        isPhotosListLoading: false
      })
    case PHOTOS_ACTIONS.PHOTOS_LIST_SUCCESS:
      return Object.assign({}, state, {
        photosList: state.photosList.concat(action.data),
        isPhotosListLoading: false,
        photosListError: '',
        photosListOffset: typeof action.offset === "number"  ? (action.offset + SKIP_PHOTOS_DOCUMENTS) : state.photosListOffset,
        hasMorePhotos: (action.data && action.data.length === 0) ? false: true
      })
    case PHOTOS_ACTIONS.USER_QUERY_UPDATED:
      return Object.assign({}, state, {
        photosList: [],
        photosListOffset: 0,
        searchByUser: action.userQuery
      })

    default:
      return state;
  }
};
