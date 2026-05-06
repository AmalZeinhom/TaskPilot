import api from "@/API/axiosInstance";
import { Task } from "@/Types/Tasks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function useFetchTasks(projectId?: string, limit = 20, searchTerm = "") {
  const [tasks, setTasks] = useState<Task[]>([]); // Store tasks in state to have a single source of truth for tasks data. This way, when we update a task, we can update the tasks state directly without needing to refetch tasks from server. This will reduce the unnecessary network request.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const trimmedSearch = searchTerm.trim(); // To prevent unwanted spaces

  useEffect(() => {
    setTasks([]);
    setPage(1);
    setHasMore(true);
  }, [projectId, trimmedSearch]);

  const fetchTasks = async () => {
    if (!projectId || loading) return;

    setLoading(true);

    try {
      const res = await api.get(`/rest/v1/project_tasks`, {
        headers: { Prefer: "count=exact" },
        params: {
          project_id: `eq.${projectId}`,
          limit,
          offset: (page - 1) * limit,
          ...(trimmedSearch && {
            title: `ilike.%${trimmedSearch}%`
          })
        }
      });

      const contentRange = res.headers["content-range"];
      const total = Number(contentRange.split("/")[1]);

      setTasks((prev) => {
        // Use a set to track existing task IDs to prevent duplications when loading more tasks.
        const ids = new Set(prev.map((t) => t.id));

        const filtered = res.data.filter((t: Task) => !ids.has(t.id));

        const newTasks = [...prev, ...filtered];

        if (newTasks.length >= total) {
          setHasMore(false);
        }

        return newTasks;
      });
    } catch (err) {
      setError(true);
      console.log(err);

      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
  }, [projectId, page, trimmedSearch]);

  const loadMore = () => {
    if (!hasMore) return;
    setPage((p) => p + 1);
  };

  const updateTask = (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  return { tasks, hasMore, updateTask, loadMore, error, loading };
}
