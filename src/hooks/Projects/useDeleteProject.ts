import api from "@/API/axiosInstance";
import toast from "react-hot-toast";

export function useDeleteProject(setData: (data: any) => void) {
  const deleteProject = async (projectId: string) => {
    try {
      // optimistic update
      setData((prev: any[]) => prev.filter((p) => p.id !== projectId));

      await api.delete(`/rest/v1/projects?id=eq.${projectId}`);
      toast.success("Project deleted successfully.");

      return true;
    } catch (error) {
      toast.error("Failed to delete the project!");
      console.log(error);
    }
  };

  return { deleteProject };
}
