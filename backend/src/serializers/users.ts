import { IUser } from "../interfaces";

function getByUserNameSerializer(user: IUser) {
  const { userName, id} = user;
  return {
    userName,
    id
  }
}

module.exports.getByUserNameSerializer = getByUserNameSerializer;