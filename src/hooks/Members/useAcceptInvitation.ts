import { acceptInvitation } from "@/API/acceptInvitation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useAcceptInvitation() {
  const [loading, setLoading] = useState(false);

  const accept = async (token: string) => {
    if (loading) return; // prevent duplicate submission

    setLoading(true);

    try {
      const response = await acceptInvitation(token);
      if (response.status === 200) {
        return true;
      }
      toast.success("Invitation accepted");
      return response.data;
    } catch (err: any) {
      const status = err?.response?.status;
      const message = err?.response?.data?.message;
      if (status === 401) {
        toast.error("Unauthorized, You must be logged in");
      } else if (status === 403) {
        toast.error("You are not allowed to accept this invitation");
      } else if (message?.toLowerCase().includes("invalid")) {
        toast.error("Invalid invitation link");
      } else if (message?.toLowerCase().icludes("expired")) {
        toast.error("This invitation has expired");
      } else {
        toast.error(message || "Something went wrong");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { accept, loading };
}
