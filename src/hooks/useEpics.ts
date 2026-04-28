// import Cookies from "js-cookie";
// import { useQuery } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { Epic } from "@/Types/Epic";
// import api from "@/API/axiosInstance";

// type EpicsResponse = {
//   epics: Epic[];
//   totalCount: number;
// };

// export function useEpics(projectId?: string, currentPage: number = 1, limit: number = 9) {
//   const navigate = useNavigate();

//   const fetchEpics = async (): Promise<EpicsResponse> => {
//     if (!projectId) {
//       return { epics: [], totalCount: 0 };
//     }

//     const accessToken = Cookies.get("access_token");

//     if (!accessToken) {
//       navigate("/login");
//       return { epics: [], totalCount: 0 };
//     }

//     try {
//       const response = await api.get<Epic[]>(`/rest/v1/project_epics`, {
//         params: {
//           project_id: `eq.${projectId}`,
//           limit,
//           offset: (currentPage - 1) * limit
//         }
//       });

//       const contentRange = response.headers["content-range"] || response.headers["Content-Range"];

//       const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

//       return {
//         epics: response.data,
//         totalCount
//       };
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         navigate("/login");
//       }

//       throw error; // Rethrow the error to be handled by useQuery's isError
//     }
//   };

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["epics", projectId, currentPage], // Cash identity, Page 1 != Page 2
//     queryFn: fetchEpics,
//     enabled: !!projectId, // Only implement the function if the projectId is available
//     placeholderData: (prev) => prev // Keep previous data while loading new data to prevent UI breaking
//   });

//   return {
//     epics: data?.epics || [],
//     totalCount: data?.totalCount || 0,
//     isLoading,
//     isError
//   };
// }
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "@/API/axiosInstance";
import { useEffect, useState } from "react";
import { Epic } from "@/Types/Epic";

export function useEpics(projectId?: string, limit = 9, page = 1) {
  const navigate = useNavigate();
  const [data, setData] = useState<Epic[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);
  const from = (page - 1) * limit;

  const fetchEpics = async () => {
    setLoading(true);

    if (!projectId) {
      setLoading(false);
      return;
    }

    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("UNAUTHORIZED"); // This isn't a clean architectural approach, but it works for now. A better way would be to have a global auth state that this hook can check instead of directly navigating here.
    }

    try {
      const response = await api.get(`/rest/v1/project_epics`, {
        headers: {
          Prefer: "count=exact" // Ask the server to include the total count of items in the Content-Range header
        },
        params: {
          project_id: `eq.${projectId}`,
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
    fetchEpics();
  }, [projectId, page, limit]);

  return {
    data,
    loading,
    totalPages: Math.ceil(total / limit),
    page,
    error,
    setData
  };
}
