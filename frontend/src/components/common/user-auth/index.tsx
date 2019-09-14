import { PureComponent } from "react";
import firebase from "firebase";
import { connect } from "react-redux";
import { saveUser } from "../../../redux/actions/users";

class UserAuth extends PureComponent<{ saveUser: Function }, {}> {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
      if (user) {
        firebase
          .database()
          .ref("/users/" + user.uid + "/userName")
          .once("value")
          .then((snapshot: firebase.database.DataSnapshot) => {
            this.props.saveUser({
              userId: user.uid,
              userName: snapshot.val()
            });
          })
          .catch(error => {
            this.props.saveUser(null);
          });
      } else {
        this.props.saveUser(null);
      }
    });
  }

  render() {
    return this.props.children;
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    saveUser: (userData: object) => dispatch(saveUser(userData))
  };
}

export default connect(
  null,
  mapDispatchToProps
)(UserAuth);
