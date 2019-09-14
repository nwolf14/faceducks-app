import React, {
  memo,
  FunctionComponent,
  useEffect,
  useCallback,
  useRef
} from "react";
import { List, AutoSizer } from "react-virtualized";
import { connect } from "react-redux";
import firebase from "firebase";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { writeData, readAllData, clearAllData } from "../../../lib/utility";
import { photosListSelector } from "../../../redux/selectors/photos";
import PhotoItem, { IPhotoItemProps } from "./photo-item";
import { Spinner } from "../../";
import { IUserData } from "../../../interfaces";
import {
  photosListSuccess,
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
  userData: IUserData;
  photosList: Array<IPhotoItemProps>;
  error: string;
  isLoading: boolean;
  offline: boolean;
  savePhotosList: Function;
  requestPhotosList: Function;
}> = memo(
  ({
    userData,
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
      ({ index, style }: { index: number; style: any }) => {
        return (
          <PhotoItem
            {...photosList[index]}
            key={photosList[index].key}
            style={style}
            index={index}
          />
        );
      },
      [photosList]
    );

    const getPhotosListFromDb = useCallback(() => {
      const dbCollection = firebase.database().ref("/photos");

      requestPhotosList();

      if (!offline) {
        dbCollection
          .orderByChild("date")
          .once("value")
          .then(snapshot => {
            const data: any = [];
            clearAllData("posts").then(() => {
              snapshot.forEach(function(child) {
                const post = child.val();
                data.push(post);
                writeData("posts", post);
              });

              savePhotosList(data);
            });
          });
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
  savePhotosList: (data: Array<any>) => dispatch(photosListSuccess(data)),
  requestPhotosList: () => dispatch(requestPhotosList())
});

const mapStateToProps = (state: any) => ({
  userData: state.user.userData,
  photosList: photosListSelector(state),
  isLoading: state.photos.isPhotosListLoading,
  error: state.photos.photosListError,
  offline: state.common.offline
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosList);
