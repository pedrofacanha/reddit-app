import type { Post, User, Comment, Vote } from './generated/prisma/client';

declare global {
  namespace Express {
    interface User {
      id: number;
      uname: string;
      password: string;
    }
  }
}

export type TPost = Post;
export type TUser = User;
export type TComment = Comment;
export type TVote = Vote;

export type TUsers = { [key: number]: TUser };
export type TPosts = { [key: number]: TPost };
export type TComments = { [key: number]: TComment };
export type TVotes = TVote[];
