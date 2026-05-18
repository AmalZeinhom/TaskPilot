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
import useTaskDetails from "@/hooks/Tasks/useTaskDetails";
import { X, Timer } from "lucide-react";
import EditableText from "@/Utils/EditableText";
import toast from "react-hot-toast";
import api from "@/API/axiosInstance";
import { Task } from "@/Types/Tasks";
import CustomDatePicker from "@/Utils/DatePicker";

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

  //why editable text? there is 2 sources if truth, 1. task from API, 2. editableText user edits(optimistic updates)
  const [editableTask, setEditableTask] = useState(task ?? null); //task ?? null this is a Nullish Coalescing Operator which means if task exists use it, if it null or undefiend use null
  //per-field loading
  const [fieldLoading, setFieldLoading] = useState({
    title: false,
    description: false,
    status: false,
    due_date: false
  });

  useEffect(() => {
    if (task) {
      setEditableTask(task);
    }
  }, [task]);

  const updateTaskField = async (field: keyof Task, value: any) => {
    if (!editableTask) return;

    //Save the old value before changing, this is called snapshot for rollback. incase there is any error occured
    const previousValue = editableTask[field];

    if (previousValue === value) return;

    setEditableTask((prev) => (prev ? { ...prev, [field]: value } : prev));

    setFieldLoading((prev) => ({ ...prev, [field]: true }));

    try {
      const res = await api.patch(`/rest/v1/tasks?id=eq.${editableTask.id}`, { [field]: value });

      console.log(res.data);

      toast.success(`Field updated`);
    } catch (err) {
      console.log(err);
      // rollback
      setEditableTask((prev) => (prev ? { ...prev, [field]: previousValue } : prev));
    } finally {
      setFieldLoading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const selectedStatusColor = editableTask?.status
    ? statusSelectColors[editableTask.status]
    : undefined;

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-50 w-full h-[80vh] md:w-[850px] md:h-[80vh] flex flex-col md:flex-row overflow-vi rounded-t-3xl md:rounded-2xl mt-10 shadow-2xl"
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
            {!loading && !error && editableTask && (
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
                        {editableTask?.task_id}
                      </p>
                    </span>

                    <span className="hidden md:flex items-center gap-1">
                      <LuLayers size={14} className="text-gray-500" />

                      <p className="text-xs text-gray-600">{editableTask?.epic?.epic_id}</p>
                    </span>
                  </div>

                  {/* MOBILE CLOSE */}
                  <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                    <X size={18} />
                  </button>
                </div>

                {/* TITLE */}
                <EditableText
                  value={editableTask?.title || ""}
                  loading={fieldLoading.title}
                  required
                  onSave={(value) => updateTaskField("title", value)}
                  className="text-2xl md:text-3xl font-bold text-[#0B1B46] leading-tight"
                />

                {/* MOBILE STATUS */}
                <div className="flex items-center gap-2 mt-4 md:hidden">
                  <div
                    className="rounded-full overflow-hidden"
                    style={{
                      backgroundColor: selectedStatusColor?.bg
                    }}
                  >
                    <select
                      value={editableTask?.status || ""}
                      onChange={(e) => updateTaskField("status", e.target.value as TaskStatusType)}
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

                  {/* <div>
                    <p className="text-xs text-gray-500 font-semibold mb-3">STATUS</p>

                    <Selector
                      options={statusOptions()}
                      value={statusOptions().find((o) => o.value === editableTask?.status)}
                      onChange={(option) => {
                        const newStatus = option?.value as TaskStatusType;

                        updateTaskField("status", newStatus);
                      }}
                      controlBg={selectedStatusColor?.bg}
                      controlText={selectedStatusColor?.text}
                    />
                  </div> */}

                  <div className="flex items-center gap-1 bg-blue-100 rounded-full px-3 py-1.5">
                    <LuLayers size={11} className="text-blue-700" />

                    <p className="text-[10px] font-semibold text-blue-700">
                      {editableTask?.epic?.epic_id}
                    </p>
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
                          editableTask?.assignee?.name
                        )}`}
                      >
                        {getInitials(editableTask?.assignee?.name || "UN")}
                      </div>

                      <p className="text-xs font-semibold text-gray-700">
                        {editableTask?.assignee?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {/* DUE DATE */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">DUE DATE</p>

                    {/* <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-700" />

                      <p className="text-xs font-semibold text-gray-700">
                        {formatedDate(editableTask?.due_date)}
                      </p>
                    </span> */}
                    <CustomDatePicker
                      selectedDate={
                        editableTask?.due_date ? new Date(editableTask?.due_date) : null
                      }
                      onDateChange={(date) => {
                        updateTaskField("due_date", date ? date.toISOString() : null);
                      }}
                      className="w-fit"
                      inputClassName="text-right text-sm font-semibold text-gray-700 border-none bg-transparent cursor-pointer"
                      showIcon={false}
                    />
                  </div>

                  {/* CREATED BY */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">CREATED BY</p>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${getAvatarColor(
                          editableTask?.created_by?.name
                        )}`}
                      >
                        {getInitials(editableTask?.created_by?.name || "UN")}
                      </div>

                      <p className="text-xs font-semibold text-gray-700">
                        {editableTask?.created_by?.name}
                      </p>
                    </div>
                  </div>

                  {/* CREATED AT */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">CREATED AT</p>

                    <span className="flex items-center gap-1">
                      <Timer size={12} className="text-gray-700" />

                      <p className="text-xs font-semibold text-gray-700">
                        {formatedDate(editableTask?.created_at)}
                      </p>
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-3">DESCRIPTION</p>

                  <EditableText
                    value={editableTask?.description || ""}
                    loading={fieldLoading.description}
                    onSave={(value) =>
                      updateTaskField("description", value.trim() === "" ? null : value)
                    }
                    className="text-sm text-gray-700 leading-tight"
                  />
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
                value={statusOptions().find((o) => o.value === editableTask?.status)}
                onChange={(option) => {
                  const newStatus = option?.value as TaskStatusType;

                  updateTaskField("status", newStatus);
                }}
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
                  )} text-white w-7 h-7 flex items-center justify-center text-xs font-semibold`}
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

            {/* Reporter */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">REPORTER</p>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full ${getAvatarColor(editableTask?.created_by?.name)} text-white w-7 h-7 flex items-center justify-center text-xs font-semibold`}
                >
                  {getInitials(editableTask?.created_by?.name || "")}
                </span>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {editableTask?.created_by?.name || "Unassigned"}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* DATES */}
            <div className="space-y-5">
              <div className="grid grid-cols-2">
                <p className="text-gray-500 text-sm">Due Date</p>

                <div>
                  <CustomDatePicker
                    selectedDate={editableTask?.due_date ? new Date(editableTask?.due_date) : null}
                    onDateChange={(date) => {
                      updateTaskField("due_date", date ? date.toISOString() : null);
                    }}
                    className="w-fit"
                    inputClassName="text-right text-sm font-semibold text-gray-700 border-none bg-transparent"
                    showIcon={false}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <p className="text-gray-500 text-sm">Created At</p>

                <p className="text-gray-700 text-sm font-semibold">
                  {formatedDate(editableTask?.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Modal>
  );
}
