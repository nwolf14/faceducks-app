import { IUserDataRaw } from "../interfaces";

export function userDataMapper(userData: IUserDataRaw | undefined) {
  if (userData) {
    const mappedFriendsList =
      userData &&
      userData.friends.reduce((acc: any, curr) => {
        acc[curr.userName] = curr;

        return acc;
      }, {});
    const mappedFriendsRequestsOutcoming =
      userData &&
      userData.friends_requests_outcoming.reduce((acc: any, curr) => {
        acc[curr.toUser] = curr;

        return acc;
      }, {});
    const mappedFriendsRequestsIncoming =
      userData &&
      userData.friends_requests_incoming.reduce((acc: any, curr) => {
        acc[curr.fromUser] = curr;

        return acc;
      }, {});

    return {
      ...userData,
      friends: mappedFriendsList,
      friends_requests_outcoming: mappedFriendsRequestsOutcoming,
      friends_requests_incoming: mappedFriendsRequestsIncoming
    };
  }
}
