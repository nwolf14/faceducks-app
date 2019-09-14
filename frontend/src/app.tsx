import React, { Component, Suspense, lazy } from "react";
import { Route, Switch } from "react-router-dom";
import { ROUTES } from "./lib/constants";
import { Navigation, Spinner, Popover, UserAuth, Notifier } from "./components";
import "./app.scss";

const HomePage = lazy(() => import("./pages/home"));
const RegisterPage = lazy(() => import("./pages/register"));
const LoginPage = lazy(() => import("./pages/login"));
const TakePicturePage = lazy(() => import("./pages/take-picture"));

class App extends Component<{}, {}> {
  render() {
    return (
      <Notifier>
        <UserAuth>
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
        </UserAuth>
      </Notifier>
    );
  }
}

export default App;
