import api from "./axiosInstance";

export const acceptInvitation = (token: string) => {
  return api.post("/rest/v1/rpc/accept_invitation", {
    p_token: token
  });
};
