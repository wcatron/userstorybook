export type AuthRoles = "user" | "admin";

export type User = {
  name: string;
  id: string;
  roles: AuthRoles[];
};

export interface UserRepository {
  get(id: string): Promise<User | undefined>;
  create(name: string, roles: AuthRoles[]): Promise<User>;
}

export type AuthContext = { id: string; roles: AuthRoles[] }

export type UseCaseContext = {
  auth?: AuthContext;
  datasources: { userRepository: UserRepository };
};
