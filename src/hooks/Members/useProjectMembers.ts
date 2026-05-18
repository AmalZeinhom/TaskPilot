import { useEffect, useState } from "react";
import { ProjectMembersAPI } from "@/API/projectMembersAPI";

type Member = {
  member_id: string;
  user_id: string;
  role: string;
  email: string;
  metadata: {
    name: string;
  };
};

export const useProjectMembers = (projectId?: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert the duplicated data array to unduplicated array (raw API data => consistent UI data)
  const normalizeMembers = (data: Member[]) => {
    // Using map(hash table) => O(n) = faster, cleaner, scalable instead of filter + find
    // The problem of filter is O(n square) which is slow
    const map = new Map<string, Member>();

    data.forEach((member) => {
      if (!map.has(member.user_id)) {
        map.set(member.user_id, member);
      }
    });

    // Conver the map into array
    return Array.from(map.values());
  };

  const fetchMembers = async () => {
    if (!projectId) return;

    try {
      setLoading(true);

      const res = await ProjectMembersAPI.get(projectId);

      setMembers(normalizeMembers(res.data));
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateMemberRole = (memberId: string, role: string) => {
    setMembers((prev) => prev.map((m) => (m.member_id === memberId ? { ...m, role } : m)));
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  return { members, loading, updateMemberRole };
};
