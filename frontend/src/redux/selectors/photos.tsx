import { createSelector } from "reselect";
import { IApplicationState } from "../store";

export const photosListSelector = createSelector(
  [(state: IApplicationState) => state.photos.photosList],
  photosList => photosList
);
