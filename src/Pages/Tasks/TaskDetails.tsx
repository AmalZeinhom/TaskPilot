// import Modal from "@/Components/Modal";
// import { Task } from "@/Types/Tasks";
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

// type TaskDetailsProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   task?: Task | null;
// };

// export default function TaskDetails({ isOpen, onClose, task }: TaskDetailsProps) {
//   const [selectedStatus, setSelectedStatus] = useState<TaskStatusType | undefined>(undefined);

//   const initials = getInitials(task?.assignee?.name || "Unassigned");
//   const color = getAvatarColor(task?.assignee?.name);

//   // Sync task status when modal opens / task changes
//   useEffect(() => {
//     setSelectedStatus(task?.status ?? undefined);
//   }, [task]);

//   const selectedStatusColor = selectedStatus ? statusSelectColors[selectedStatus] : undefined;

//   if (!isOpen || !task) return null; //prevents unnecessary renders

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       <motion.div
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ duration: 0.3 }}
//         className="bg-brightness-primary w-[700px] h-[80vh] flex overflow-hidden rounded-md mt-10"
//       >
//         <div className="flex flex-col flex-[3] justify-between border-r border-gray-200">
//           <div className="p-4">
//             <div className="flex items-center gap-4 mb-4">
//               <span className="bg-blue-100 rounded-md px-2 py-1">
//                 <p className="text-xs text-blue-darkBlue font-semibold">{task.task_id}</p>
//               </span>

//               <span className="flex items-center gap-1">
//                 <LuLayers size={14} className="text-gray-500" />
//                 <p className="text-xs text-gray-600">{task.epic?.epic_id}</p>
//               </span>
//             </div>

//             <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>

//             <hr className="border-gray-200 w-full my-4" />

//             <div>
//               <p className="text-xs text-gray-800 font-semibold mb-2">DESCRIPTION</p>
//               <p className="text-gray-800 text-xs">{task.description}</p>
//             </div>
//           </div>

//           <div className="flex justify-between items-center bg-blue-50 p-2">
//             <span className="flex items-center gap-2">
//               <BsLink size={14} className="text-gray-600" />
//               <p className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">Copy Link</p>
//             </span>

//             <button
//               onClick={onClose}
//               className="text-blue-darkBlue bg-blue-200 rounded-sm px-2 py-1 text-xs font-semibold hover:scale-105 transition"
//             >
//               Close
//             </button>
//           </div>
//         </div>

//         <div className="flex-[1] bg-blue-50 p-5 flex flex-col gap-10">
//           <div>
//             <p className="text-xs text-gray-500 font-semibold mb-3">STATUS</p>

//             <Selector
//               options={statusOptions()}
//               value={statusOptions().find((o) => o.value === selectedStatus)}
//               onChange={(option) => setSelectedStatus(option?.value as TaskStatusType | undefined)}
//               controlBg={selectedStatusColor?.bg}
//               controlText={selectedStatusColor?.text}
//             />
//           </div>

//           <div>
//             <p className="text-xs text-gray-500 font-semibold mb-3">ASSIGNEE</p>

//             <div className="border border-gray-300 px-3 py-2 flex items-center gap-2 bg-brightness-primary rounded-md">
//               <span
//                 className={`rounded-full ${color} flex items-center justify-center text-white p-2 text-sm font-semibold`}
//               >
//                 {initials}
//               </span>
//               <span className="w-[150px]">
//                 <p className="text-gray-700 font-semibold text-sm">{task?.assignee?.name}</p>
//                 <p className="text-gray-500 text-xs">{task?.assignee?.department}</p>
//               </span>
//             </div>
//           </div>

//           <div>
//             <p className="text-xs text-gray-500 font-semibold mb-3">REPORTER</p>

//             <div className="flex items-center gap-2 mb-5">
//               <span
//                 className={`rounded-full ${color} flex items-center justify-center text-white p-1 text-xs font-semibold`}
//               >
//                 {initials}
//               </span>
//               <span className="w-[150px]">
//                 <p className="text-gray-700 font-semibold text-sm">{task?.assignee?.name}</p>
//               </span>
//             </div>
//             <hr className="border-gray-200 w-full" />
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <p className="text-gray-500 text-sm">Due Date</p>
//               <p className="text-gray-700 font-semibold text-sm">{formatedDate(task.due_date)}</p>
//             </div>

//             <div className="flex justify-between items-center">
//               <p className="text-gray-500 text-sm">Created At</p>
//               <p className="text-gray-700 font-semibold text-sm">{formatedDate(task.created_at)}</p>
//             </div>
//           </div>
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

  // Sync task status when modal opens / task changes
  useEffect(() => {
    setSelectedStatus(task?.status ?? undefined);
  }, [task]);

  const selectedStatusColor = selectedStatus ? statusSelectColors[selectedStatus] : undefined;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-brightness-primary w-[700px] h-[80vh] flex overflow-hidden rounded-md mt-10"
      >
        <div className="flex flex-col flex-[3] justify-between border-r border-gray-200">
          <div className="p-4">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}

            {error && <p className="text-sm text-red-500">Failed to load task details</p>}

            {!loading && !error && !task && <p className="text-sm text-gray-500">Task not found</p>}

            {!loading && task && (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-blue-100 rounded-md px-2 py-1">
                    <p className="text-xs text-blue-darkBlue font-semibold">{task.task_id}</p>
                  </span>

                  <span className="flex items-center gap-1">
                    <LuLayers size={14} className="text-gray-500" />
                    <p className="text-xs text-gray-600">{task.epic?.epic_id}</p>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>

                <hr className="border-gray-200 w-full my-4" />

                <p className="text-xs text-gray-800 font-semibold mb-2">DESCRIPTION</p>
                <p className="text-gray-800 text-xs">{task.description}</p>
              </>
            )}
          </div>

          <div className="flex justify-between items-center bg-blue-50 p-2">
            <span className="flex items-center gap-2">
              <BsLink size={14} className="text-gray-600" />
              <p className="text-xs text-gray-600 cursor-pointer">Copy Link</p>
            </span>

            <button
              onClick={onClose}
              className="text-blue-darkBlue bg-blue-200 rounded-sm px-2 py-1 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-[1] bg-blue-50 p-5 flex flex-col gap-10">
          {!loading && task && (
            <>
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

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-3">ASSIGNEE</p>

                <div className="border border-gray-300 px-3 py-2 w-[200px] flex items-center gap-2 bg-brightness-primary rounded-md">
                  <span
                    className={`rounded-full ${getAvatarColor(
                      task.assignee?.name
                    )} text-white p-2 text-sm font-semibold`}
                  >
                    {getInitials(task.assignee?.name || "Unassigned")}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {task.assignee?.name || "Unassigned"}
                    </p>
                    <p className="text-xs text-gray-500">{task.assignee?.department || "Member"}</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 w-full" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-500 text-sm">Due Date</p>
                  <p className="text-gray-700 text-sm font-semibold">
                    {formatedDate(task.due_date)}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className="text-gray-500 text-sm">Created At</p>
                  <p className="text-gray-700 text-sm font-semibold">
                    {formatedDate(task.created_at)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </Modal>
  );
}
