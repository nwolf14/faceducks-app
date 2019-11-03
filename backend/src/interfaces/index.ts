export interface IUserInput {
  email?: string;
  password?: string;
  repeatPassword?: string;
  userName?: string;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  userName: string;
  is_mail_confirmed: boolean;
  created_at: Date;
  avatar: string;
  friends: Array<any>;
  friends_requests: Array<any>;
  notifications: Array<any>;
}

export interface IPhotoInput {
  author?: string;
  authorId?: string;
  description?: string;
  photo?: string;
  hashtagsList?: string;
}

export interface IPhoto {
  id: string;
  author: string;
  description: string;
  photo: string;
  hashtagsList: string;
  created_at: Date;
}
