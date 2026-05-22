import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "@/API/axiosInstance";
import { useEffect, useState } from "react";
import { Epic } from "@/Types/Epic";

export function useEpics(projectId?: string, limit = 9, page = 1, searchTerm = "") {
  const navigate = useNavigate();
  const [data, setData] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  const from = (page - 1) * limit;

  const fetchEpics = async () => {
    setLoading(true);
    setError(false);

    if (!projectId) {
      setLoading(false);
      return;
    }

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("UNAUTHORIZED"); // This isn't a clean architectural approach, but it works for now. A better way would be to have a global auth state that this hook can check instead of directly navigating here.
      return;
    }

    try {
      const response = await api.get(`/rest/v1/project_epics`, {
        headers: {
          Prefer: "count=exact" // Ask the server to include the total count of items in the Content-Range header
        },
        params: {
          project_id: `eq.${projectId}`,
          limit,
          offset: from,
          // This is called conditional params injection which means add title if there is a search, don't add it if there isn't
          // This operation == if (searchTerm) {params.title = `ilike.%${searchTerm}%`}
          ...(searchTerm && {
            title: `ilike.%${searchTerm}%` // ilike.%25${searchTerm}%25 What is 25% exactly means? It causes an error
          })
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
    fetchEpics();
  }, [projectId, page, limit, searchTerm]);

  return {
    data,
    loading,
    totalPages: Math.ceil(total / limit),
    page,
    error,
    setData,
    fetchEpics
  };
}
