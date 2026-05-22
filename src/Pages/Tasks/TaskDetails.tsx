import Modal from "@/Components/Modal";
import { LuLayers } from "react-icons/lu";
import { motion } from "framer-motion";
import { BsLink } from "react-icons/bs";
import Selector from "@/Utils/Selector";
import { useEffect, useMemo, useState } from "react";
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
import { TaskDetailsProps } from "@/Types/TaskDetails";
import { Member } from "@/Types/Member";
import { Epic } from "@/Types/Epic";
import { AssigneeOption } from "@/Types/Assignee";

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

  const [editableTask, setEditableTask] = useState<Task | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);

  const [fieldLoading, setFieldLoading] = useState({
    title: false,
    description: false,
    status: false,
    due_date: false,
    assignee: false,
    epic: false
  });

  useEffect(() => {
    if (task) {
      setEditableTask(task);
    }
  }, [task]);

  const setLoadingField = (field: keyof typeof fieldLoading, value: boolean) => {
    setFieldLoading((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTaskField = async (
    field: keyof Task,
    value: any,
    loadingField?: keyof typeof fieldLoading
  ) => {
    if (!editableTask) return;

    const previousValue = editableTask[field];

    const isSame = JSON.stringify(previousValue) === JSON.stringify(value);

    if (isSame) return;

    if (field === "title" && (!value || value.trim() === "")) {
      toast.error("Title is required");
      return;
    }

    setEditableTask((prev) =>
      prev
        ? {
            ...prev,
            [field]: value
          }
        : prev
    );

    if (loadingField) {
      setLoadingField(loadingField, true);
    }

    try {
      await api.patch(`/rest/v1/tasks?id=eq.${editableTask.id}`, {
        [field]: value
      });

      toast.success("Field updated");
    } catch (err) {
      console.log(err);

      setEditableTask((prev) =>
        prev
          ? {
              ...prev,
              [field]: previousValue
            }
          : prev
      );

      toast.error("Failed to update task. Please try again.");
    } finally {
      if (loadingField) {
        setLoadingField(loadingField, false);
      }
    }
  };

  const fetchMembers = async () => {
    if (!projectId) return;

    try {
      const res = await api.get("/rest/v1/get_project_members", {
        params: {
          project_id: `eq.${projectId}`,
          select: `
            user_id,
            metadata
          `
        }
      });

      setMembers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load members");
    }
  };

  const fetchEpics = async () => {
    if (!projectId) return;

    try {
      const res = await api.get("/rest/v1/epics", {
        params: {
          project_id: `eq.${projectId}`,
          select: "id,epic_id,title"
        }
      });

      setEpics(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load epics");
    }
  };

  useEffect(() => {
    if (isOpen && projectId) {
      fetchMembers();
      fetchEpics();
    }
  }, [isOpen, projectId]);

  const assigneeOptions: AssigneeOption[] = useMemo(() => {
    return [
      {
        label: "Unassigned",
        value: null
      },
      ...members.map((member) => ({
        label: member.metadata?.name || "Unknown User",
        value: member.user_id
      }))
    ];
  }, [members]);

  const selectedAssignee = assigneeOptions.find(
    (option) => option.value === editableTask?.assignee?.id
  );

  const epicOptions = [
    {
      label: "No Epic",
      value: null
    },
    ...epics.map((epic) => ({
      label: epic.epic_id,
      value: epic.id
    }))
  ];

  const selectedEpic = epicOptions.find((option) => option.value === editableTask?.epic?.id);

  const selectedStatusColor = editableTask?.status
    ? statusSelectColors[editableTask.status]
    : undefined;

  const updateAssignee = async (selectedValue: string | null) => {
    if (!editableTask) return;

    const previousAssignee = editableTask.assignee;

    const selectedMember = members.find((member) => member.user_id === selectedValue);

    const newAssignee = selectedMember
      ? {
          id: selectedMember.user_id,
          name: selectedMember.metadata?.name || "Unknown",
          email: selectedMember.metadata?.email || "",
          department: selectedMember.metadata?.department || null,
          avatar: selectedMember.metadata?.avatar || null
        }
      : null;

    if (previousAssignee?.id === newAssignee?.id) return;

    setEditableTask((prev) =>
      prev
        ? {
            ...prev,
            assignee: newAssignee
          }
        : prev
    );

    setLoadingField("assignee", true);

    try {
      await api.patch(`/rest/v1/tasks?id=eq.${editableTask.id}`, {
        assignee_id: selectedValue
      });

      toast.success("Assignee updated");
    } catch (err) {
      console.log(err);

      setEditableTask((prev) =>
        prev
          ? {
              ...prev,
              assignee: previousAssignee
            }
          : prev
      );

      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoadingField("assignee", false);
    }
  };

  const updateEpic = async (epicId: string | null) => {
    if (!editableTask) return;

    const previousEpic = editableTask.epic;

    const selectedEpicData = epics.find((epic) => epic.id === epicId);

    const newEpic = selectedEpicData
      ? {
          id: selectedEpicData.id,
          epic_id: selectedEpicData.epic_id,
          title: selectedEpicData.title
        }
      : null;

    if (previousEpic?.id === newEpic?.id) return;

    setEditableTask((prev) =>
      prev
        ? {
            ...prev,
            epic: newEpic,
            epic_id: epicId
          }
        : prev
    );

    setLoadingField("epic", true);

    try {
      await api.patch(`/rest/v1/tasks?id=eq.${editableTask.id}`, {
        epic_id: epicId
      });

      toast.success("Epic updated");
    } catch (err) {
      console.log(err);

      setEditableTask((prev) =>
        prev
          ? {
              ...prev,
              epic: previousEpic,
              epic_id: previousEpic?.id || null
            }
          : prev
      );

      toast.error("Failed to update task. Please try again.");
    } finally {
      setLoadingField("epic", false);
    }
  };

  useEffect(() => {
    if (!editableTask?.epic?.id) return;

    const epicStillExists = epics.some((epic) => epic.id === editableTask.epic?.id);

    if (!epicStillExists && epics.length > 0) {
      setEditableTask((prev) =>
        prev
          ? {
              ...prev,
              epic: null,
              epic_id: null
            }
          : prev
      );
    }
  }, [epics, editableTask]);

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

                      <p className="text-xs text-gray-600">
                        {editableTask?.epic?.epic_id || "No Epic"}
                      </p>
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
                  onSave={(value) => updateTaskField("title", value.trim(), "title")}
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
                      disabled={fieldLoading.status}
                      value={editableTask?.status || ""}
                      onChange={(e) =>
                        updateTaskField("status", e.target.value as TaskStatusType, "status")
                      }
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

                    <p className="text-[10px] font-semibold text-blue-700">
                      {editableTask?.epic?.epic_id || "NO EPIC"}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200 my-6" />

                {/* MOBILE CARDS */}
                <div className="grid grid-cols-2 gap-3 mb-10 md:hidden">
                  {/* ASSIGNEE */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">ASSIGNEE</p>

                    <Selector
                      options={assigneeOptions}
                      value={selectedAssignee}
                      isDisabled={fieldLoading.assignee}
                      onChange={(option) => updateAssignee(option?.value || null)}
                    />
                  </div>

                  {/* DUE DATE */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-2 font-bold">DUE DATE</p>

                    <CustomDatePicker
                      selectedDate={
                        editableTask?.due_date ? new Date(editableTask?.due_date) : null
                      }
                      onDateChange={(date) => {
                        if (date && date < new Date(new Date().setHours(0, 0, 0, 0))) {
                          toast.error("Past dates are not allowed");
                          return;
                        }

                        updateTaskField("due_date", date ? date.toISOString() : null, "due_date");
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
                    value={editableTask?.description || "No description provided"}
                    loading={fieldLoading.description}
                    onSave={(value) =>
                      updateTaskField(
                        "description",
                        value.trim() === "" ? null : value,
                        "description"
                      )
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
                isDisabled={fieldLoading.status}
                value={statusOptions().find((o) => o.value === editableTask?.status)}
                onChange={(option) => {
                  const newStatus = option?.value as TaskStatusType;

                  updateTaskField("status", newStatus, "status");
                }}
                controlBg={selectedStatusColor?.bg}
                controlText={selectedStatusColor?.text}
              />
            </div>

            {/* ASSIGNEE */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">ASSIGNEE</p>

              <Selector
                options={assigneeOptions}
                value={selectedAssignee}
                isDisabled={fieldLoading.assignee}
                onChange={(option) => updateAssignee(option?.value || null)}
              />
            </div>

            {/* EPIC */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">EPIC</p>

              <Selector
                options={epicOptions}
                value={selectedEpic}
                isDisabled={fieldLoading.epic}
                onChange={(option) => updateEpic(option?.value || null)}
              />
            </div>

            {/* Reporter */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-3">REPORTER</p>

              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full ${getAvatarColor(
                    editableTask?.created_by?.name
                  )} text-white w-7 h-7 flex items-center justify-center text-xs font-semibold`}
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
                      if (date && date < new Date(new Date().setHours(0, 0, 0, 0))) {
                        toast.error("Past dates are not allowed");
                        return;
                      }

                      updateTaskField("due_date", date ? date.toISOString() : null, "due_date");
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
