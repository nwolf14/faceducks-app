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
}

export interface IPhotoInput {
  author?: string;
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
