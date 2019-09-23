import React, { memo } from "react";
import { Fab, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { PhotosList } from "../../components/page-home";
import { LinkWrapper } from "../../components/_HOCs";
import "./styles.scss";

const HomePage: React.SFC<{}> = memo(() => {
  const userToken = localStorage.getItem("JWT");
  return (
    <main className="home-page">
    <PhotosList />
      {userToken && (
        <LinkWrapper
          ariaLabel="add new photo"
          href="/take-picture"
          className="home-page__take-picture-link"
        >
          <Tooltip title="Add new photo">
            <Fab color="primary" aria-label="Add">
              <AddIcon />
            </Fab>
          </Tooltip>
        </LinkWrapper>
      )}
    </main>
  );
});

export default HomePage;
