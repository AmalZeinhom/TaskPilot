import api from "@/API/axiosInstance";
import { Task } from "@/Types/Tasks";
import { useEffect, useState } from "react";

export default function useListTasks(epicId?: string) {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const tasksList = async () => {
    setLoading(true);
    setError(false);

    if (!epicId) return;

    try {
      const response = await api.get(`/rest/v1/project_tasks?epic_id=eq.${epicId}`);

      setData(response.data);
    } catch (err: any) {
      console.log(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    tasksList();
  }, [epicId]);

  return { data, loading, error };
}
