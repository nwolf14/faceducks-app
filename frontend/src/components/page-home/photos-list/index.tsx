import React, { memo, FunctionComponent, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { readAllData, clearAllData, writeData } from "../../../lib/utility";
import { photosListSelector } from "../../../redux/selectors/photos";
import PhotoItem, { IPhotoItemProps } from "./photo-item";
import { Spinner } from "../../";
import {
  saveCachedPhotosList,
  requestPhotosList
} from "../../../redux/actions/photos";
import { Grid } from "@material-ui/core";
import { generateUniqueKey } from "../../../lib/functions";
import './styles.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      justifyContent: "center",
      height: "90vh",
      padding: theme.spacing(2)
    }
  })
);

const PhotosList: FunctionComponent<{
  photosList: Array<IPhotoItemProps>;
  offset: number;
  hasMorePhotos: boolean;
  error: string;
  isLoading: boolean;
  offline: boolean;
  savePhotosList: Function;
  requestPhotosList: Function;
}> = memo(
  ({
    photosList,
    error,
    isLoading,
    offset,
    hasMorePhotos,
    offline,
    savePhotosList,
    requestPhotosList
  }) => {
    const classes = useStyles();
    const getPhotosListFromDb = useCallback(() => {
      if (!offline) {
        requestPhotosList(offset);
      } else {
        const cachedPosts = readAllData("posts");
        cachedPosts.then(data => savePhotosList(data));
      }
    }, [savePhotosList, requestPhotosList, offset]);

    useEffect(() => {
      clearAllData("posts");
      photosList.forEach((photo: any) => writeData("posts", photo));
    }, [photosList]);

    if (isLoading) {
      return <Spinner size={30} />;
    }

    if (error) {
    }

    return (
      <div className={`photo-list`} aria-live="polite">
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={8} md={6}>
            <InfiniteScroll
              loader={Loader}
              hasMore={hasMorePhotos}
              loadMore={getPhotosListFromDb}
            >
              {photosList.map(photo => (
                <PhotoItem {...photo} key={photo._id} />
              ))}
            </InfiniteScroll>
          </Grid>
        </Grid>
      </div>
    );
  }
);

const mapDispatchToProps = (dispatch: any) => ({
  savePhotosList: (data: Array<any>) => dispatch(saveCachedPhotosList(data)),
  requestPhotosList: (offset: number) => dispatch(requestPhotosList(offset))
});

const mapStateToProps = (state: any) => ({
  photosList: photosListSelector(state),
  isLoading: state.photos.isPhotosListLoading,
  error: state.photos.photosListError,
  offset: state.photos.photosListOffset,
  hasMorePhotos: state.photos.hasMorePhotos,
  offline: state.common.offline
});

const Loader = (
  <div key={generateUniqueKey()} className='photos-list-loader'>
    <CircularProgress size={30} />
  </div>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosList);
