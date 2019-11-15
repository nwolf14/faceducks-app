import React, { memo, FunctionComponent, useCallback } from "react";
import { connect } from "react-redux";

import "./styles.scss";
import { updatePhotosListAuthorFilter } from "../../../redux/actions/photos";
import { Autosuggest } from "../..";
import { SuggestionItem } from "../../shared/autosuggest/suggestionsBox";

interface ISuggestedUser {
  userName: string;
  id: string;
}

const UsersAutosuggester: FunctionComponent<{
  updatePhotosListAuthorFilter: Function;
}> = memo(({ updatePhotosListAuthorFilter }) => {

  const mapSuggestionListResponse = useCallback(
    (user: ISuggestedUser): SuggestionItem => ({
      value: user.userName,
      label: user.userName
    }),
    []
  );

  const updateFilter = useCallback((value: string) => {
    updatePhotosListAuthorFilter(value);
  }, []);

  return (
    <Autosuggest
      handleSuggestionSelect={updateFilter}
      suggestionListApiUrl="/api/users/getByUserName/"
      mapSuggestionListResponse={mapSuggestionListResponse}
    />
  );
});

function mapDispatchToProps(dispatch: any) {
  return {
    updatePhotosListAuthorFilter: (value: string) =>
      dispatch(updatePhotosListAuthorFilter(value))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(UsersAutosuggester);
