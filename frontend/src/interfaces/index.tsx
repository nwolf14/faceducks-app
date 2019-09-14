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

export interface IUserData {
  userName: string;
  userId: string;
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

export interface IOptionsObject<T extends Object> {
  [key: string]: T;
}

export interface IAnyObject {
  [key: string]: any;
}

export interface IMappedForm {
  [key: string]: string;
}

export interface IFirebaseError {
  code: string;
  message: string;
}

export interface IObserver {
  next: Function;
  error?: Function;
  complete?: Function;
};

export interface IUserDataProps {
  userData: object;
}
