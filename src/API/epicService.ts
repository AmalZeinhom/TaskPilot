import api from "./axiosInstance";

type CreateEpicPayload = {
  title: string;
  description?: string;
  assignee_id?: string | null;
  deadline?: string | null;
  project_id: string;
};

export async function createEpicService(payload: CreateEpicPayload) {
  const response = await api.post("/rest/v1/epics", payload);

  return response.data;
}
