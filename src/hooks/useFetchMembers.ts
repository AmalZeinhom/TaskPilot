import api from "@/API/axiosInstance";
import { useParams } from "react-router-dom";

export default function useFetchMembers(setAssigneeOptions: (data: any) => void) {
  const { projectId } = useParams<{ projectId: string }>();

  const fetchAssignees = async () => {
    try {
      const res = await api.get("/rest/v1/get_project_members", {
        params: {
          project_id: `eq.${projectId}`
        }
      });

      const mapped = res.data.map((m: any) => ({
        label: m.metadata.name,
        value: m.metadata.sub
      }));

      setAssigneeOptions(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  return { fetchAssignees };
}
