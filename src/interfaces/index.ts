export interface IUser {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  readonly updated_at: Date;
  deleted_at?: Date | null;
}
