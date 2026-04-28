import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLightBulb } from "react-icons/hi";
import { CiCalendar } from "react-icons/ci";
import { useEpics } from "@/hooks/useEpics";
import { useState, useEffect } from "react";
import EpicsModal from "@/Pages/Epics/EpicsModal";
import useProjectName from "@/hooks/useProjectName";
import Pagination from "@/Components/Pagination";
import api from "@/API/axiosInstance";
import { formatedDate } from "@/Utils/FormatedDate";
import { getInitials } from "@/Utils/GetInitials";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import { useUpdateEpic } from "@/hooks/useUpdateEpics";
import { Member } from "@/Types/Member";

export default function ListEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);

  const [searchParams, setSearchParams] = useSearchParams(); //Sync pagination state with URL.
  // Store only the selected epic's ID to minimize the amount of data stored in state and rely on the epics list as the source of truth for epic details. This way, when we update an epic, we only need to update the epics list, and the selected epic details will automatically reflect the changes without needing to manage two separate states.
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null); // Also this prevent duplication

  const [members, setMembers] = useState<Member[]>([]); // Store members list to avoid refetching members every time we open the modal for different epic.
  const [loadingMembers, setLoadingMembers] = useState(true); // Control loading state for members fetching to show loading state in assignee selector in modal.

  const pageFromURL = Number(searchParams.get("page")) || 1; // Get current page from URL, if not present default to 1. This is the source of truth for pagination state.
  const { data, loading, error, totalPages, setData } = useEpics(projectId, 9, pageFromURL); // Data is the source of truth for epics list. Whereas setData is used to update the epics list without refetching.

  // This is the solution of multiple sources of truth problem. Instead of storing the selected epic's data in new state. We will derive the selected epic's data from the epics list using the selectedEpicId. So we have only one source of truth for epics data which is the data from useEpics hook. This way, when we update an epic, we only need to update the epics list, and the selected epic details will automatically reflect the changes without needing to manage two separate states.
  const selectedEpic = data.find((e) => e.id === selectedEpicId) || null;

  const { updateEpic } = useUpdateEpic(setData, members);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const res = await api.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`);
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setLoadingMembers(false);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  if (error) {
    return <p className="text-red-500">Failed to load Epics</p>;
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((x) => (
          <div key={x} className="h-32 w-full bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-gray-600 text-lg mb-3">No epics found for this project.</p>
        <Link
          to={`/projects/${projectId}/epics/new`}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create New Epic
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto bg-brightness-light rounded-2xl p-6 sm:p-8 mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"
        >
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to="/projects" className="text-gray-500 hover:text-gray-700">
              Projects /
            </Link>
            <Link to={`/projects/${projectId}`} className="text-gray-500 hover:text-gray-700">
              {projectName || projectId} /
            </Link>
            <span className="text-gray-700 font-medium">Epics</span>
          </div>

          <Link
            to={`/projects/${projectId}/epics/new`}
            className="bg-blue-darkBlue text-white px-4 py-2 rounded-xl hover:bg-cyan-800 transition w-full sm:w-auto text-center"
          >
            + Create New Epic
          </Link>
        </motion.div>

        {!loading && data.length > 0 && (
          <div className="flex flex-col gap-6">
            {data.map((epic) => {
              const assigneeInitials = getInitials(epic.assignee?.name || "Unassigned");
              const bgColor = getAvatarColor(epic.assignee?.name);
              return (
                <div key={epic.id} onClick={() => setSelectedEpicId(epic.id)}>
                  <div className="bg-brightness-primary rounded-xl shadow-xl p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 hover:cursor-pointer transition">
                    <div className="flex flex-wrap items-center gap-6">
                      <HiOutlineLightBulb size={24} />
                      <div className="flex flex-col gap-2">
                        <p className="font-bold text-sm">{epic.title}</p>

                        <div className="flex items-center gap-3 text-xs">
                          <p># {epic.epic_id}</p>
                          <p>
                            Opened by <span className="font-bold">{epic.created_by.name}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-16">
                      <div>
                        <p className="text-xs font-bold text-darkness-iconList">Created At: </p>
                        <div className="flex items-center gap-1">
                          <CiCalendar size={20} />
                          <p className="text-gray-700 font-medium text-sm">
                            {formatedDate(epic.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full ${bgColor} text-white w-8 h-8 flex items-center justify-center font-bold`}
                        >
                          {/* for ensure that the name is not Undefined */}
                          <p className="text-sm text-white font-semibold">{assigneeInitials}</p>
                        </div>
                        <p className="font-bold text-gray-500">
                          {epic.assignee?.name ?? "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Pagination
          currentPage={pageFromURL}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setSearchParams({ page: String(newPage) }); // URL is the source of truth. Refetch epics with new page number from URL.
          }}
        />

        <EpicsModal
          epic={selectedEpic} // Get epics from the data directly using the slectedEpicId.
          onClose={() => setSelectedEpicId(null)}
          onUpdate={(updatedFields) => {
            if (!selectedEpicId) return;
            updateEpic(selectedEpicId, updatedFields);
          }}
          members={members}
          loadingMembers={loadingMembers}
        />
      </motion.div>
    </div>
  );
}
