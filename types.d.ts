export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface TaskFields {
  user: string;
  title: string;
  description: string | null;
  status: string;
}

export type TaskFieldsWithoutUser = Omit<TaskFields, 'user'>;
