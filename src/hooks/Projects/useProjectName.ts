import api from "@/API/axiosInstance";
import { useEffect, useState } from "react";

export default function useProjectName(projectId?: string) {
  const [projectName, setProjectName] = useState<string>("");

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectName = async () => {
      try {
        const response = await api.get(`/rest/v1/projects?id=eq.${projectId}`);

        if (response.data && response.data.length > 0) {
          setProjectName(response.data[0].name);
        }
      } catch (err) {
        console.error("Failed to fetch project name:", err);
      }
    };

    fetchProjectName();
  }, [projectId]);

  return projectName;
}
