import { randomUUID } from "crypto";
import { AuthRoles, User, UserRepository } from "../usecases/context";

let localStore = new Map<string, User>();

export class UserRepositoryFile implements UserRepository {
  async get(id: string) {
    return localStore.get(id);
  }
  async create(name: string, roles: AuthRoles[]) {
    const id = randomUUID();
    return localStore
      .set(id, {
        id,
        name,
        roles,
      })
      .get(id)!
  }
}
