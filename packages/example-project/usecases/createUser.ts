import { UseCase } from "@userstorybook/core";
import { AuthRoles, UseCaseContext, User } from "./context";

type CreateUserInput = { name: string; roles: AuthRoles[] };

const adminList = ["John", "Sarah"];
function isOnTheAdminList(name: string) {
  return adminList.includes(name);
}

export const createUser: UseCase<CreateUserInput, UseCaseContext, Promise<User>> = async function (
  { name, roles },
  { auth, datasources: { userRepository } }
) {
  if (!auth?.roles.includes("admin")) {
    throw new Error("Improper role for creating a new user");
  }
  if (roles.includes("admin") && !(isOnTheAdminList(auth.id) &&
    isOnTheAdminList(name))) {
    throw new Error("Improper role for creating a new user with admin role");
  }
  const user = await userRepository.create(name, roles);
  return user;
};
