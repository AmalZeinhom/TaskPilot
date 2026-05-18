import api from "@/API/axiosInstance";
import { Task } from "@/Types/Tasks";
import { useEffect, useState } from "react";

type UseTaskDetailsProps = {
  taskId?: string;
  projectId?: string;
  enabled?: boolean;
};

export default function useTaskDetails({ taskId, projectId, enabled = true }: UseTaskDetailsProps) {
  const [data, setData] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || !taskId || !projectId) return;

    const fetchTask = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await api.get(
          `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`
        );
        console.log(res);

        setData(res.data?.[0] ?? null);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, projectId, enabled]);

  return { data, loading, error };
}
