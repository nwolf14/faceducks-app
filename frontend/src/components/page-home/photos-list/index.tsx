import React, { memo, FunctionComponent, useEffect, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { connect } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import { readAllData, clearAllData, writeData } from "../../../lib/utility";
import { photosListSelector } from "../../../redux/selectors/photos";
import PhotoItem, { IPhotoItemProps } from "./photo-item";
import {
  saveCachedPhotosList,
  getPhotosList
} from "../../../redux/actions/photos";
import { Grid } from "@material-ui/core";
import { generateUniqueKey } from "../../../lib/functions";
import './styles.scss';
import { userData } from "../../../interfaces";

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
  offline: boolean;
  authorFilter: string;
  savePhotosList: Function;
  getPhotosList: Function;
  userData: userData
}> = memo(
  ({
    userData,
    photosList,
    error,
    offset,
    hasMorePhotos,
    offline,
    authorFilter,
    savePhotosList,
    getPhotosList
  }) => {
    const classes = useStyles();

    const getPhotosListFromDb = useCallback(() => {
      if (!offline) {
        getPhotosList(offset, authorFilter);
      } else {
        const cachedPosts = readAllData("posts");
        cachedPosts.then(data => savePhotosList(data));
      }
    }, [savePhotosList, getPhotosList, offset, authorFilter]);

    useEffect(() => {
      getPhotosListFromDb();
    }, [authorFilter])

    useEffect(() => {
      // clearAllData("posts");
      // photosList.forEach((photo: any) => writeData("posts", photo));
    }, [photosList]);

    if (error) {
    }

    return (
      <div className={`photo-list`} aria-live="polite">
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={8} md={6}>
            <InfiniteScroll
              initialLoad={false}
              loader={Loader}
              hasMore={hasMorePhotos}
              loadMore={getPhotosListFromDb}
            >
              {photosList.map(photo => (
                <PhotoItem {...photo} userData={userData} key={photo._id} />
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
  getPhotosList: (offset: number, authorFilter: string) => dispatch(getPhotosList(offset, authorFilter))
});

const mapStateToProps = (state: any) => ({
  userData: state.user.userData,
  photosList: photosListSelector(state),
  error: state.photos.photosListError,
  offset: state.photos.photosListOffset,
  authorFilter: state.photos.photosListAuthorFilter,
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
