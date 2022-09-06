export type AuthRoles = "user" | "admin";

export type User = {
  name: string;
  id: string;
  roles: AuthRoles[];
};

export interface UserRepository {
  get(id: string): User | undefined;
  create(name: string, roles: AuthRoles[]): User;
}

export type UseCaseContext = {
  auth?: { id: string; roles: AuthRoles[] };
  datasources: { userRespository: UserRepository };
};
