// import Modal from "@/Components/Modal";
// import { LuLayers } from "react-icons/lu";
// import { motion } from "framer-motion";
// import { BsLink } from "react-icons/bs";
// import Selector from "@/Utils/Selector";
// import { useEffect, useState } from "react";
// import { statusOptions, TaskStatusType } from "@/Constants/taskStatus";
// import { statusSelectColors } from "@/Constants/statusColors";
// import { getInitials } from "@/Utils/GetInitials";
// import { getAvatarColor } from "@/Utils/GetAvatarColor";
// import { formatedDate } from "@/Utils/FormatedDate";

// import useTaskDetails from "@/hooks/useTaskDetails";

// type TaskDetailsProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   taskId?: string;
//   projectId?: string;
// };

// export default function TaskDetailsModal({ isOpen, onClose, taskId, projectId }: TaskDetailsProps) {
//   const {
//     data: task,
//     loading,
//     error
//   } = useTaskDetails({
//     taskId,
//     projectId,
//     enabled: isOpen
//   });

//   const [selectedStatus, setSelectedStatus] = useState<TaskStatusType | undefined>(undefined);

//   // Sync task status when modal opens / task changes
//   useEffect(() => {
//     setSelectedStatus(task?.status ?? undefined);
//   }, [task]);

//   const selectedStatusColor = selectedStatus ? statusSelectColors[selectedStatus] : undefined;

//   if (!isOpen) return null;

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="bg-brightness-primary w-full h-[95vh] md:w-[700px] md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-2xl md:rounded-xl mt-10"
//       >
//         <div className="flex flex-col flex-[3] justify-between border-r border-gray-200 overflow-y-auto">
//           <div className="p-4">
//             {loading && <p className="text-sm text-gray-500">Loading...</p>}

//             {error && <p className="text-sm text-red-500">Failed to load task details</p>}

//             {!loading && !error && !task && <p className="text-sm text-gray-500">Task not found</p>}

//             {!loading && task && (
//               <>
//                 <div className="flex items-center gap-4 mb-4">
//                   <span className="bg-blue-100 rounded-md px-2 py-1">
//                     <p className="text-xs text-blue-darkBlue font-semibold">{task.task_id}</p>
//                   </span>

//                   <span className="flex items-center gap-1">
//                     <LuLayers size={14} className="text-gray-500" />
//                     <p className="text-xs text-gray-600">{task.epic?.epic_id}</p>
//                   </span>
//                 </div>

//                 <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>

//                 <hr className="border-gray-200 w-full my-4" />

//                 <p className="text-xs text-gray-800 font-semibold mb-2">DESCRIPTION</p>
//                 <p className="text-gray-800 text-xs">{task.description}</p>
//               </>
//             )}
//           </div>

//           <div className="flex justify-between items-center bg-blue-50 p-2">
//             <span className="flex items-center gap-2">
//               <BsLink size={14} className="text-gray-600" />
//               <p className="text-xs text-gray-600 cursor-pointer">Copy Link</p>
//             </span>

//             <button
//               onClick={onClose}
//               className="text-blue-darkBlue bg-blue-200 rounded-sm px-2 py-1 text-xs font-semibold"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//         <div className="flex-[1] bg-blue-50 p-5 flex flex-col gap-10">
//           {!loading && task && (
//             <>
//               <div>
//                 <p className="text-xs text-gray-500 font-semibold mb-3">STATUS</p>

//                 <Selector
//                   options={statusOptions()}
//                   value={statusOptions().find((o) => o.value === selectedStatus)}
//                   onChange={(option) =>
//                     setSelectedStatus(option?.value as TaskStatusType | undefined)
//                   }
//                   controlBg={selectedStatusColor?.bg}
//                   controlText={selectedStatusColor?.text}
//                 />
//               </div>

//               <div>
//                 <p className="text-xs text-gray-500 font-semibold mb-3">ASSIGNEE</p>

//                 <div className="border border-gray-300 px-3 py-2 w-[200px] flex items-center gap-2 bg-brightness-primary rounded-md">
//                   <span
//                     className={`rounded-full ${getAvatarColor(
//                       task.assignee?.name
//                     )} text-white p-2 text-sm font-semibold`}
//                   >
//                     {getInitials(task.assignee?.name || "Unassigned")}
//                   </span>

//                   <div>
//                     <p className="text-sm font-semibold text-gray-700">
//                       {task.assignee?.name || "Unassigned"}
//                     </p>
//                     <p className="text-xs text-gray-500">{task.assignee?.department || "Member"}</p>
//                   </div>
//                 </div>
//               </div>

//               <hr className="border-gray-200 w-full" />

//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <p className="text-gray-500 text-sm">Due Date</p>
//                   <p className="text-gray-700 text-sm font-semibold">
//                     {formatedDate(task.due_date)}
//                   </p>
//                 </div>

//                 <div className="flex justify-between">
//                   <p className="text-gray-500 text-sm">Created At</p>
//                   <p className="text-gray-700 text-sm font-semibold">
//                     {formatedDate(task.created_at)}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </motion.div>
//     </Modal>
//   );
// }
import Modal from "@/Components/Modal";
import { LuLayers } from "react-icons/lu";
import { motion } from "framer-motion";
import { BsLink } from "react-icons/bs";
import Selector from "@/Utils/Selector";
import { useEffect, useState } from "react";
import { statusOptions, TaskStatusType } from "@/Constants/taskStatus";
import { statusSelectColors } from "@/Constants/statusColors";
import { getInitials } from "@/Utils/GetInitials";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import { formatedDate } from "@/Utils/FormatedDate";
import useTaskDetails from "@/hooks/useTaskDetails";
import { X, Calendar, Timer } from "lucide-react";

type TaskDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  projectId?: string;
};

export default function TaskDetailsModal({ isOpen, onClose, taskId, projectId }: TaskDetailsProps) {
  const {
    data: task,
    loading,
    error
  } = useTaskDetails({
    taskId,
    projectId,
    enabled: isOpen
  });

  const [selectedStatus, setSelectedStatus] = useState<TaskStatusType | undefined>(undefined);

  useEffect(() => {
    setSelectedStatus(task?.status ?? undefined);
  }, [task]);

  const selectedStatusColor = selectedStatus ? statusSelectColors[selectedStatus] : undefined;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 w-full h-[80vh] md:w-[850px] md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-t-3xl md:rounded-2xl mt-10 shadow-2xl"
      >
        {/* LEFT CONTENT */}
        <div className="flex flex-col flex-1 md:flex-[3] justify-between overflow-y-auto border-gray-200 md:border-r">
          <div className="p-4 md:p-6 flex-1">
            {/* LOADING */}
            {loading && (
              <div className="animate-pulse space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-20 rounded-full bg-gray-200" />
                  <div className="h-6 w-24 rounded-full bg-gray-200" />
                </div>

                <div className="space-y-2">
                  <div className="h-8 w-[80%] rounded bg-gray-200" />
                  <div className="h-8 w-[60%] rounded bg-gray-200" />
                </div>

                <div className="h-[1px] w-full bg-gray-200" />

                <div className="space-y-3">
                  <div className="h-4 w-28 rounded bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-full rounded bg-gray-200" />
                    <div className="h-3 w-[90%] rounded bg-gray-200" />
                    <div className="h-3 w-[70%] rounded bg-gray-200" />
                  </div>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-3">
                  Failed to load task
                </div>

                <p className="text-sm text-gray-500 max-w-[300px]">
                  Something went wrong while fetching task details.
                </p>
              </div>
            )}

            {/* EMPTY */}
            {!loading && !error && !task && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <LuLayers size={24} className="text-gray-400" />
                </div>

                <h3 className="text-gray-700 font-semibold mb-1">Task Not Found</h3>

                <p className="text-sm text-gray-500">This task may have been deleted.</p>
              </div>
            )}

            {/* CONTENT */}
            {!loading && !error && task && (
              <>
                {/* MOBILE HANDLE */}
                <div className="flex justify-center mb-4 md:hidden">
                  <div className="w-12 h-1.5 rounded-full bg-gray-300" />
                </div>

                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-blue-100 rounded-md px-2 py-1">
                      <p className="text-[10px] md:text-xs text-blue-darkBlue font-semibold">
                        {task.task_id}
                      </p>
                    </span>

                    <span className="hidden md:flex items-center gap-1">
                      <LuLayers size={14} className="text-gray-500" />

                      <p className="text-xs text-gray-600">{task.epic?.epic_id}</p>
                    </span>
                  </div>

                  {/* MOBILE CLOSE */}
                  <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>

                {/* TITLE */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B1B46] leading-tight">
                  {task.title}
                </h2>

                {/* MOBILE STATUS */}
                <div className="flex items-center gap-2 mt-4 md:hidden">
                  <div
                    className="rounded-full overflow-hidden"
                    style={{
                      backgroundColor: selectedStatusColor?.bg
                    }}
                  >
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as TaskStatusType)}
                      className="bg-transparent px-3 py-1.5 text-[10px] font-semibold outline-none border-none appearance-none cursor-pointer"
                      style={{
                        color: selectedStatusColor?.text
                      }}
                    >
                      {statusOptions().map((status) => (
                        <option key={status.value} value={status.value} className="text-black">
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-blue-100 rounded-full px-3 py-1.5">
                    <LuLayers size={11} className="text-blue-700" />

                    <p className="text-[10px] font-semibold text-blue-700">{task.epic?.epic_id}</p>
                  </div>
                </div>

                <hr className="border-gray-200 my-6" />

                {/* MOBILE CARDS */}
                <div className="grid grid-cols-2 gap-3 mb-10 md:hidden">
                  {/* ASSIGNEE */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">ASSIGNEE</p>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${getAvatarColor(
                          task.assignee?.name
                        )}`}
                      >
                        {getInitials(task.assignee?.name || "UN")}
                      </div>

                      <p className="text-xs font-semibold text-gray-700">
                        {task.assignee?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {/* DUE DATE */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">DUE DATE</p>

                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-700" />

                      <p className="text-xs font-semibold text-gray-700">
                        {formatedDate(task.due_date)}
                      </p>
                    </span>
                  </div>

                  {/* CREATED BY */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">CREATED BY</p>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${getAvatarColor(
                          task.created_by?.name
                        )}`}
                      >
                        {getInitials(task.created_by?.name || "UN")}
                      </div>

                      <p className="text-xs font-semibold text-gray-700">{task.created_by?.name}</p>
                    </div>
                  </div>

                  {/* CREATED AT */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">CREATED AT</p>

                    <span className="flex items-center gap-1">
                      <Timer size={12} className="text-gray-700" />

                      <p className="text-xs font-semibold text-gray-700">
                        {formatedDate(task.created_at)}
                      </p>
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3">DESCRIPTION</p>

                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm leading-7 text-gray-700">{task.description}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          {!loading && !error && task && (
            <div className="hidden md:flex justify-between items-center bg-blue-50 p-4 border-t border-gray-200">
              <span className="flex items-center gap-2">
                <BsLink size={14} className="text-gray-600" />

                <p className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition">
                  Copy Link
                </p>
              </span>

              <button
                onClick={onClose}
                className="text-blue-darkBlue bg-blue-200 rounded-md px-4 py-2 text-sm font-semibold hover:scale-105 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        {!loading && !error && task && (
          <div className="hidden md:flex flex-[1] bg-blue-50 p-5 flex-col gap-8">
            {/* STATUS */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">STATUS</p>

              <Selector
                options={statusOptions()}
                value={statusOptions().find((o) => o.value === selectedStatus)}
                onChange={(option) =>
                  setSelectedStatus(option?.value as TaskStatusType | undefined)
                }
                controlBg={selectedStatusColor?.bg}
                controlText={selectedStatusColor?.text}
              />
            </div>

            {/* ASSIGNEE */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">ASSIGNEE</p>

              <div className="border border-gray-200 px-3 py-3 flex items-center gap-3 bg-white rounded-xl">
                <span
                  className={`rounded-full ${getAvatarColor(
                    task.assignee?.name
                  )} text-white w-10 h-10 flex items-center justify-center text-sm font-semibold`}
                >
                  {getInitials(task.assignee?.name || "UN")}
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {task.assignee?.name || "Unassigned"}
                  </p>

                  <p className="text-xs text-gray-500">{task.assignee?.department || "Member"}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* DATES */}
            <div className="space-y-5">
              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Due Date</p>

                <p className="text-gray-700 text-sm font-semibold">{formatedDate(task.due_date)}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Created At</p>

                <p className="text-gray-700 text-sm font-semibold">
                  {formatedDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Modal>
  );
}
