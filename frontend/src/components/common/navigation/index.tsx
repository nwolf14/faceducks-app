import React, { memo, FunctionComponent, useCallback } from "react";
import {
  fade,
  makeStyles,
  Theme,
  createStyles
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import ArrowRightAlt from "@material-ui/icons/ArrowRightAlt";
import { withRouter, RouteComponentProps } from "react-router";
import { Tooltip } from "@material-ui/core";
import { connect } from "react-redux";
import { userData } from "../../../interfaces";

import { logoutUser } from "../../../redux/actions/users";
import { LinkWrapper } from "../../_HOCs";
import "./styles.scss";
import { updatePhotosListAuthorFilter } from "../../../redux/actions/photos";
import { Autosuggest } from "../..";
import { SuggestionItem } from "../../shared/autosuggest/suggestionsBox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
      zIndex: 100
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none"
      }
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block"
      }
    },
    toolbar: {
      zIndex: 100
    },
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
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "flex"
      }
    },
    sectionMobile: {
      display: "flex",
      [theme.breakpoints.up("md")]: {
        display: "none"
      }
    }
  })
);

interface ISuggestedUser {
  userName: string;
  id: string;
}

const Navigation: FunctionComponent<
  {
    userData: userData;
    logoutUser: Function;
    updatePhotosListAuthorFilter: Function;
  } & RouteComponentProps<{}>
> = memo(({ history, logoutUser, userData, updatePhotosListAuthorFilter }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [
    mobileMoreAnchorEl,
    setMobileMoreAnchorEl
  ] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function signOut() {
    localStorage.removeItem("JWT");
    logoutUser();
    history.push("/");
  }

  function handleProfileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const mapSuggestionListResponse = useCallback(
    (user: ISuggestedUser): SuggestionItem => ({
      value: user.id,
      label: user.userName
    }),
    []
  );

  const updateFilter = useCallback((value: string) => {
    updatePhotosListAuthorFilter(value);
  }, []);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {userData && (
        <MenuItem>
          <IconButton aria-label="Show 11 new notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
      )}
      {userData && (
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="set new avatar"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Avatar</p>
        </MenuItem>
      )}
      {userData && (
        <MenuItem onClick={signOut}>
          <IconButton
            aria-label="Logout"
            color="inherit"
            aria-controls={menuId}
            aria-haspopup="true"
          >
            <PowerSettingsNew />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      )}

      {!userData && (
        <LinkWrapper href="/login" ariaLabel="go to login or register page">
          <MenuItem>
            <IconButton
              aria-label="Register / login"
              color="inherit"
              aria-controls={menuId}
              aria-haspopup="true"
            >
              <ArrowRightAlt />
            </IconButton>
            <p>Login / Register</p>
          </MenuItem>
        </LinkWrapper>
      )}
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Open drawer"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            <LinkWrapper href="/" ariaLabel="go to home page">
              face-ducks.com
            </LinkWrapper>
          </Typography>
          <Autosuggest
            handleSuggestionSelect={updateFilter}
            suggestionListApiUrl="/api/users/getByUserName/"
            mapSuggestionListResponse={mapSuggestionListResponse}
          />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {userData && (
              <Tooltip title="Set new avatar">
                <IconButton
                  edge="end"
                  aria-label="set new avatar"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
            )}
            {userData && (
              <Tooltip title="Notifications">
                <IconButton aria-label="Show new notifications" color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}
            {userData && (
              <Tooltip title="Logout">
                <IconButton
                  aria-label="Logout"
                  color="inherit"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={signOut}
                >
                  <PowerSettingsNew />
                </IconButton>
              </Tooltip>
            )}
            {!userData && (
              <LinkWrapper href="/login" ariaLabel="go to login page">
                <p>Login / Register</p>
              </LinkWrapper>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
});

function mapStateToProps(state: any) {
  return { userData: state.user.userData };
}

function mapDispatchToProps(dispatch: any) {
  return {
    logoutUser: () => dispatch(logoutUser()),
    updatePhotosListAuthorFilter: (value: string) =>
      dispatch(updatePhotosListAuthorFilter(value))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navigation));
