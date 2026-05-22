import api from "@/API/axiosInstance";

export const getProjectEpics = async (projectId: string) => {
  const res = await api.get("/rest/v1/project_epics", {
    params: {
      project_id: `eq.${projectId}`,
      select: "id,title,epic_id"
    }
  });

  return res.data;
};
