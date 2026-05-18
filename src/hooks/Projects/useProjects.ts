import api from "@/API/axiosInstance";
import { Project } from "@/Types/Project";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useProjects(limit = 9, page = 1) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  const from = (page - 1) * limit;
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/rest/v1/rpc/get_projects`, {
        headers: {
          Prefer: "count=exact" // Ask the server to include the total count of items in the Content-Range header
        },
        params: {
          limit,
          offset: from
        }
      });

      const contentRange = response.headers["content-range"] || response.headers["Content-Range"];

      const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

      setData(response.data);
      setTotal(totalCount);
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, limit]);

  return {
    data,
    loading,
    totalPages: Math.ceil(total / limit),
    page,
    error,
    setData,
    fetchProjects
  };
}
