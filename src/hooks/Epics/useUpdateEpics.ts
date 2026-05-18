// import api from "@/API/axiosInstance";
// import { useState } from "react";
// import toast from "react-hot-toast";

// export function useUpdateEpic() {
//   const [loading, setLoading] = useState(false);

//   const updateEpic = async (id: string, payload: any) => {
//     try {
//       setLoading(true);

//       await api.patch(`/rest/v1/epics?id=eq.${id}`, payload, {});

//       toast.success("Epic Updated Successfully");
//       return true;
//     } catch {
//       toast.error("Failed to Update Epic");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { updateEpic, loading };
// }
// useUpdateEpic.ts

import api from "@/API/axiosInstance";
import { Epic } from "@/Types/Epic";
import { Member } from "@/Types/Member";

export function useUpdateEpic(
  setData: React.Dispatch<React.SetStateAction<Epic[]>>,
  members: Member[]
) {
  const updateEpic = async (epicId: string, updatedFields: Partial<Epic>) => {
    try {
      let apiFields = { ...updatedFields };
      const localFields = { ...updatedFields };

      // handle assignee
      if (updatedFields.assignee_id !== undefined) {
        const selectedMember = members.find((m) => m.user_id === updatedFields.assignee_id);

        localFields.assignee = selectedMember
          ? {
              sub: selectedMember.user_id,
              name: selectedMember.metadata.name,
              email: selectedMember.metadata.email,
              department: ""
            }
          : null;

        apiFields = { assignee_id: updatedFields.assignee_id };
      }

      // 1. API
      await api.patch(`/rest/v1/epics?id=eq.${epicId}`, apiFields);

      // 2. Local state
      setData((prev) =>
        prev.map((epic) => (epic.id === epicId ? { ...epic, ...localFields } : epic))
      );
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return { updateEpic };
}
