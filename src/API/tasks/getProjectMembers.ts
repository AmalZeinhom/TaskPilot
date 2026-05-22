import api from "@/API/axiosInstance";

export const getProjectMembers = async (projectId: string) => {
  const res = await api.get("/rest/v1/get_project_members", {
    params: {
      project_id: `eq.${projectId}`,
      select: `
        user_id,
        email,
        metadata
      `
    }
  });

  return res.data;
};
