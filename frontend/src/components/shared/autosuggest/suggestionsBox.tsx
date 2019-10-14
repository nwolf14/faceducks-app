import React, {
  memo,
  FunctionComponent
} from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { ClickWrapper } from "../../_HOCs";

const useStyles = makeStyles(() =>
  createStyles({
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

interface ISuggestionsBox {
  callback: Function;
  suggestionsList: Array<SuggestionItem>;
}

export type SuggestionItem = { value: string; label: string };

const SuggestionsBox: FunctionComponent<ISuggestionsBox> = memo(
  ({ callback, suggestionsList }) => {
    const classes = useStyles();

    return (
      <ul className={classes.suggestionBox}>
        {suggestionsList.map((item: SuggestionItem, index: number) => (
          <li className={classes.suggestionBoxItem} key={item.value + index}>
            <ClickWrapper
              callback={callback}
              callbackParams={[item.value]}
            >
              {item.label}
            </ClickWrapper>
          </li>
        ))}
      </ul>
    );
  }
);

export default SuggestionsBox;
