import { RefObject } from "react";

export interface IInputStructure {
  type: string;
  name: string;
  label: string;
  value: string;
  errorMsg: string;
  required: boolean;
  touched: boolean;
  isValid: boolean;
  [key: string]: any;
}

export interface IUserDataRaw {
  id: string;
  userName: string;
  is_mail_confirmed: boolean;
  avatar?: string;
  friends: Array<IFriend>;
  friends_requests_outcoming: Array<IFriendsRequestsOutcoming>;
  friends_requests_incoming: Array<IFriendsRequestsIncoming>;
  notifications: Array<any>;
}

export interface IUserData {
  id: string;
  userName: string;
  is_mail_confirmed: boolean;
  avatar?: string;
  friends: IObjectOfObject<IFriend>;
  friends_requests_outcoming: IObjectOfObject<IFriendsRequestsOutcoming>;
  friends_requests_incoming: IObjectOfObject<IFriendsRequestsIncoming>;
  notifications: Array<any>;
}

export interface IForm {
  [key: string]: IInputStructure;
}

export interface IInputTypes {
  [key: string]: string;
}

export interface IRoutes {
  [key: string]: string;
}

export interface ICanvasImageSize {
  imageHeight: number;
  imageWidth: number;
}

export interface IBase64ImageWithSize extends ICanvasImageSize {
  base64: string;
}

export interface IObjectOfObject<T extends Object> {
  [key: string]: T;
}

export interface IObjectOfAny {
  [key: string]: any;
}

export interface IObjectOfStrings {
  [key: string]: string;
}

export interface IObserver {
  next: Function;
  error?: Function;
  complete?: Function;
};

export interface IFormWithEvent {
  event: React.FormEvent<HTMLFormElement>;
  form: IForm;
  formNode: RefObject<HTMLFormElement>;
}

export interface IFriendsRequestsIncoming {
  fromUser: string;
}

export interface IFriendsRequestsOutcoming {
  toUser: string;
}

export interface IFriend {
  userName: string
}

export type userData = null | IUserData;