import api from "./axiosInstance";

type CreateTaskPayload = {
  title: string;
  description?: string;
  project_id: string;
  epic_id?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  status: string;
};

export async function createTaskService(payload: CreateTaskPayload) {
  const response = await api.post("/rest/v1/tasks", payload);

  return response.data;
}
