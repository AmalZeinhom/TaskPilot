import api from "@/API/axiosInstance";

export const ProjectMembersAPI = {
  get: (projectId: string) => api.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`)
};
