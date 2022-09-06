import { UseCase } from "@userstorybook/core";
import { UseCaseContext, User } from "./context";

export const getUser: UseCase<
  { id?: string },
  UseCaseContext,
  User | undefined
> = ({ id }, { datasources: { userRespository }, auth }) => {
  const isAdmin = auth?.roles.includes("admin");
  const belongsToUser = id == auth?.id;
  if (id && (isAdmin || belongsToUser)) {
    return userRespository.get(id);
  } else if (auth?.id) {
    return userRespository.get(auth.id);
  } else {
    throw new Error("Missing id or authenticated context required to get user");
  }
};
