interface LoggedUser {
  userId: string;
  username: string;
  email?: string;
  image: string | null;
}

export type { LoggedUser };
