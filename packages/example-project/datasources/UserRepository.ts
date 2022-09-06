import { randomUUID } from "crypto";
import { AuthRoles, User, UserRepository } from "../usecases/context";

let localStore = new Map<string, User>();

export class UserRepositoryFile implements UserRepository {
  get(id: string) {
    return localStore.get(id);
  }
  create(name: string, roles: AuthRoles[]): User {
    const id = randomUUID();
    return localStore
      .set(id, {
        id,
        name,
        roles,
      })
      .get(id)!;
  }
}
