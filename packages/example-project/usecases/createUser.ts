import { UseCase } from "@userstorybook/core";
import { UseCaseContext, User } from "./context";

type CreatUserInput = { name: string; roles?: string[] };

const adminList = ["John", "Sarah"];
function isOnTheAdminList(name: string) {
  return adminList.includes(name);
}

export const createUser: UseCase<CreatUserInput, UseCaseContext, User> = (
  { name, roles = [] },
  { auth, datasources: { userRespository } }
) => {
  if (!auth?.roles.includes("admin")) {
    throw new Error("Improper role for creating a new user");
  }
  const user = userRespository.create(name, ["user"]);
  if (
    isOnTheAdminList(auth.id) &&
    roles.includes("admin") &&
    isOnTheAdminList(user.name)
  ) {
    user.roles.push("admin");
  }
  return user;
};
