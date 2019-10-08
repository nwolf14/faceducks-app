import React, { Component, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "./lib/constants";
import { Navigation, Spinner, Popover, Notifier } from "./components";
import { connect } from "react-redux";
import { getUser } from "./redux/actions/users";

const HomePage = lazy(() => import("./pages/home"));
const RegisterPage = lazy(() => import("./pages/register"));
const LoginPage = lazy(() => import("./pages/login"));
const TakePicturePage = lazy(() => import("./pages/take-picture"));

class App extends Component<{ getUserFromToken: Function }, {}> {
  componentDidMount() {
    const JWT = localStorage.getItem("JWT");
    if (JWT) {
      this.props.getUserFromToken(JWT);
    }
  }

  render() {
    return (
      <Notifier>
        <Navigation />
        <main style={{ position: "relative" }}>
          <Suspense fallback={<Spinner size={80} />}>
            <Switch>
              <Route path={ROUTES.REGISTER} component={RegisterPage} />
              <Route path={ROUTES.LOGIN} component={LoginPage} />
              <Route path={ROUTES.TAKE_PICTURE} component={TakePicturePage} />
              <Route path={ROUTES.HOME} component={HomePage} />
            </Switch>
          </Suspense>
          <Popover />
        </main>
      </Notifier>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getUserFromToken: (JWT: string) => dispatch(getUser(JWT))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(App);
