import React, { Component, Fragment } from "react";
import { fromEvent, Subscription } from "rxjs";
import { connect } from "react-redux";
import classnames from "classnames";
import { setOfflineStatus } from "../../../redux/actions/common";
import './styles.scss';

interface INotifierProps {
  offline: boolean;
  setOfflineState: Function;
  children: JSX.Element;
}

class Notifier extends Component<INotifierProps, {}> {
  private onOfflineSubscription: Subscription | null;
  private onOnlineSubscription: Subscription | null;

  constructor(props: INotifierProps) {
    super(props);

    this.onOfflineSubscription = null;
    this.onOnlineSubscription = null;
  }

  componentDidMount() {
    this.onOfflineSubscription = fromEvent(window, "offline").subscribe(() => {
      this.props.setOfflineState(true);
    });
    this.onOnlineSubscription = fromEvent(window, "online").subscribe(() => {
      this.props.setOfflineState(false);
    });
    this.props.setOfflineState(!window.navigator.onLine);
  }

  componentWillMount() {
    if (this.onOfflineSubscription && this.onOnlineSubscription) {
      this.onOfflineSubscription.unsubscribe();
      this.onOnlineSubscription.unsubscribe();
    }
  }

  render() {
    const notifyclass = classnames("notify", {
      danger: this.props.offline
    });
    const message = "App is offline!";

    return (
      <Fragment>
        {this.props.children}
        <div className={notifyclass}>
          <p>
            <em>{message}</em>
          </p>
        </div>
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    setOfflineState: (offline: boolean) => dispatch(setOfflineStatus(offline))
  }
}

function mapStateToProps(state: any) {
  return {
    offline: state.common.offline
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);
