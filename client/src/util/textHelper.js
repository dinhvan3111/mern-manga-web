import { ROLE } from "../common/constants";

const userRoleToString = (role) => {
  switch (role) {
    case ROLE.ADMIN:
      return "Admin";
    case ROLE.USER:
      return "User";
    default:
      return "";
  }
};

export { userRoleToString };
