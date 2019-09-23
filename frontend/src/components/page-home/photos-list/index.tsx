import React, {
  memo,
  FunctionComponent,
  useEffect,
  useCallback,
  useRef
} from "react";
import { List, AutoSizer } from "react-virtualized";
import { connect } from "react-redux";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { readAllData } from "../../../lib/utility";
import { photosListSelector } from "../../../redux/selectors/photos";
import PhotoItem, { IPhotoItemProps } from "./photo-item";
import { Spinner } from "../../";
 import {
  saveCachedPhotosList,
  requestPhotosList
} from "../../../redux/actions/photos";
import { Grid } from "@material-ui/core";

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
    offline,
    savePhotosList,
    requestPhotosList
  }) => {
    const classes = useStyles();
    const isMounted = useRef(false);
    const rowRenderer = useCallback(
      ({ index, style, key }: { index: number; style: any, key: string }) => {
        return (
          <PhotoItem
            {...photosList[index]}
            key={key}
            style={style}
            index={index}
          />
        );
      },
      [photosList]
    );

    const getPhotosListFromDb = useCallback(() => {
      if (!offline) {
        requestPhotosList();
      } else {
        const cachedPosts = readAllData("posts");
        cachedPosts.then(data => savePhotosList(data));
      }
    }, [savePhotosList, requestPhotosList]);

    useEffect(() => {
      if (!isMounted.current) {
        isMounted.current = true;

        if (photosList.length === 0) {
          getPhotosListFromDb();
        }
      }
      return () => {};
    }, [photosList, isMounted, getPhotosListFromDb, requestPhotosList]);

    if (isLoading) {
      return <Spinner size={30} />;
    }

    if (error) {
    }

    return (
      <div className={`photo-list`} aria-live="polite">
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={8} md={6}>
            <div style={{ height: window.innerHeight - 90 + "px" }}>
              <AutoSizer>
                {({ width, height }) => {
                  return (
                    <List
                      width={width}
                      height={height}
                      rowCount={photosList.length}
                      rowHeight={531}
                      rowRenderer={rowRenderer}
                      overscanRowCount={5}
                    />
                  );
                }}
              </AutoSizer>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
);

const mapDispatchToProps = (dispatch: any) => ({
  savePhotosList: (data: Array<any>) => dispatch(saveCachedPhotosList(data)),
  requestPhotosList: () => dispatch(requestPhotosList())
});

const mapStateToProps = (state: any) => ({
  photosList: photosListSelector(state),
  isLoading: state.photos.isPhotosListLoading,
  error: state.photos.photosListError,
  offline: state.common.offline
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosList);
