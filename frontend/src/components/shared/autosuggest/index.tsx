import React, {
  memo,
  FunctionComponent,
  useCallback,
  ChangeEvent,
  useEffect,
  useState,
  KeyboardEvent
} from "react";
import {
  fade,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { Subject, Subscription, of } from "rxjs";
import { concatMap, catchError, debounceTime } from "rxjs/operators";
import { FetchApi } from "../../../services";
import SuggestionBox from "./suggestionsBox";
// import { isEnter } from "../../../lib/functions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25)
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
      }
    },
    searchIcon: {
      width: theme.spacing(7),
      height: "100%",
      position: "absolute",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    inputRoot: {
      color: "inherit"
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200
      }
    },
    suggestionBox: {
      position: "absolute",
      left: "0px",
      right: "0px",
      backgroundColor: "#3f51b5",
      borderRadius: ".5rem"
    },
    suggestionBoxItem: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      padding: ".5rem 1rem",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.3)"
      }
    }
  })
);

const onChangeStream: Subject<string> = new Subject();
let streamSubscription: Subscription;

const SearchBar: FunctionComponent<{
  handleSuggestionSelect: Function;
  mapSuggestionListResponse: Function;
  suggestionListApiUrl: string;
}> = memo(
  ({
    handleSuggestionSelect,
    suggestionListApiUrl,
    mapSuggestionListResponse
  }) => {
    const classes = useStyles();

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const initStream = useCallback(() => {
      streamSubscription = onChangeStream
        .pipe(
          debounceTime(500),
          concatMap(value => {
            return of(value).pipe(
              concatMap(value =>
                FetchApi.get(`${suggestionListApiUrl}${value}`)
              ),
              catchError(error => of(error))
            );
          })
        )
        .subscribe((data: any) => {
          if (data.results) {
            setSuggestedUsers(
              data.results.map(mapSuggestionListResponse)
            );
          }
        });
    }, []);

    const handleSuggestionClick = useCallback((value: string) => {
      if (value) {
        handleSuggestionSelect(value);
        setSuggestedUsers([]);
        setInputValue("");
      }
    }, []);

    // const hadleKeyPress = useCallback((event: KeyboardEvent) => {
    //   if (isEnter(event)) {
    //     const target = event.target as HTMLInputElement;
    //     handleSuggestionSelect(target.value);
    //   }
    // }, []);

    const handleInputChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setInputValue(value);

        if (value) {
          onChangeStream.next(value);
        }
      },
      [setInputValue]
    );



    useEffect(() => {
      initStream();

      return () => {
        streamSubscription.unsubscribe();
      };
    }, []);

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Filter by user name"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput
          }}
          // onKeyPress={hadleKeyPress}
          onChange={handleInputChange}
          value={inputValue}
          inputProps={{ "aria-label": "Search" }}
        />
        {suggestedUsers && (
          <SuggestionBox
            callback={handleSuggestionClick}
            suggestionsList={suggestedUsers}
          />
        )}
      </div>
    );
  }
);

export default SearchBar;
