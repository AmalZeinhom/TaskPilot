import api from "@/API/axiosInstance";

export const updateTaskFieldRequest = async (taskId: string, payload: Record<string, any>) => {
  return api.patch(`/rest/v1/tasks?id=eq.${taskId}`, payload);
};
