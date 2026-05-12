import api from "@/API/axiosInstance";
import EditableText from "@/Utils/EditableText";
import CustomDatePicker from "@/Utils/DatePicker";
import { Epic } from "@/Types/Epic";
import { User, UserCircle, Calendar, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Selector from "@/Utils/Selector";
import { formatedDate } from "@/Utils/FormatedDate";
import { getInitials } from "@/Utils/GetInitials";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import { GiFullFolder } from "react-icons/gi";
import { LuList } from "react-icons/lu";
import { PlusIcon, PlusCircle } from "lucide-react";
import useListTasks from "@/hooks/useListTasks";

interface Member {
  user_id: string;
  metadata: {
    name: string;
    email: string;
  };
}

interface EpicDetailsProps {
  epic: Epic;
  onUpdate: (data: Partial<Epic>) => void;
}

export function EpicDetails({ epic, onUpdate }: EpicDetailsProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useListTasks(epic.id);

  // Memoize options to prevent unnecessary re-renders of the Selector component
  const options = useMemo(
    () => [
      { label: "Unassigned", value: null },
      ...members.map((m) => ({
        label: m.metadata.name,
        value: m.user_id
      }))
    ],
    [members]
  );

  const selectedAssignee = options.find((o) => o.value === epic.assignee_id) || null;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);

        const res = await api.get(`/rest/v1/get_project_members?project_id=eq.${epic.project_id}`);
        setMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [epic.project_id]);

  const UserRow = ({ label, user }: { label: string; user: { name: string } }) => {
    const initials = getInitials(user.name);
    const color = getAvatarColor(user.name);
    return (
      <div className="flex items-center gap-4 text-xs md:text-sm">
        {label === "Created By" ? (
          <User size={18} className="text-gray-400 text-xs md:text-sm" />
        ) : (
          <UserCircle size={18} className="text-gray-400 text-xs md:text-sm" />
        )}

        <span className="text-gray-500 w-24 md:w-28">{label}:</span>

        <div className="flex items-center gap-2">
          <div
            className={`rounded-full ${color} text-white w-5 h-5 md:w-7 md:h-7 p-3 md:p-4 flex items-center justify-center font-semibold text-xs md:text-sm`}
          >
            {initials}
          </div>

          <p className="text-gray-800 font-medium">{user.name}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-brightness-light rounded-2xl shadow-xl max-h-[70vh] flex flex-col">
      <div className="overflow-y-auto p-5 sm:p-6 md:p-8">
        <span className="text-xs text-gray-400 mb-3 flex items-center gap-1">
          <GiFullFolder size={14} className="text-blue-darkBlue" />
          <p className="cursor-pointer hover:text-gray-500">{epic.epic_id}</p>
        </span>

        <div className="mb-5 text-lg md:text-xl font-bold text-gray-800">
          <EditableText
            value={epic.title}
            onSave={(newTitle: string) => {
              onUpdate({ title: newTitle });
            }}
          />
        </div>

        <div className="leading-relaxed text-xs md:text-sm text-gray-600 mb-3">
          <EditableText
            value={epic.description || ""}
            placeholder="Add description..."
            onSave={(newDesc: string) => {
              onUpdate({ description: newDesc });
            }}
          />
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <UserRow label="Created By" user={epic.created_by} />

          <div className="flex items-center gap-4 text-sm">
            <UserCircle size={18} className="text-gray-400" />

            <span className="text-gray-500 w-24 sm:w-28">Assignee:</span>

            <div className="w-48 sm:w-56">
              <Selector
                options={options}
                value={selectedAssignee || null}
                onChange={(option) => {
                  const newUserId = option?.value ?? null;

                  onUpdate({
                    assignee_id: newUserId
                  });
                }}
                placeholder={loadingMembers ? "Loading..." : "Select Assignee"}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-4">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-gray-500 w-28">Created At:</span>
            </div>
            <p className="text-gray-800 font-medium">{formatedDate(epic.created_at)}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Calendar size={18} className="text-gray-400" />
            <span className="text-gray-500 w-24 sm:w-28">Deadline:</span>

            <div className="w-48 sm:w-56">
              <CustomDatePicker
                selectedDate={epic.deadline ? new Date(epic.deadline) : null}
                onDateChange={(date) => {
                  onUpdate({
                    deadline: date ? date.toISOString() : undefined
                  });
                }}
                className="bg-brightness-primary text-gray-600 border border-gray-200 rounded-md px-3"
                inputClassName="bg-blue-formBlue rounded-md"
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-200 my-6" />

        <div className="flex justify-between items-center mb-5">
          <p className="text-lg text-gray-800 font-semibold">Tasks</p>

          {/* Mobile */}
          <span className="md:hidden block text-sm text-gray-700 bg-blue-200 px-2 py-1 rounded-xl">
            {data?.length ?? 0} Tasks
          </span>

          {/* Desktop */}
          <button
            onClick={() =>
              navigate(`/projects/${projectId}/tasks/new`, {
                state: { epicId: epic.id }
              })
            }
            className="hidden md:flex cursor-pointer font-bold text-sm items-center gap-1 text-blue-800 hover:text-blue-950 transition"
          >
            <PlusIcon size={16} />
            Add Task
          </button>
        </div>

        {error ? (
          <p className="text-red-500 mx-auto text-center">Failed to load Tasks</p>
        ) : loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3].map((x) => (
              <div key={x} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div>
            <LuList size={40} className="text-blue-500 bg-blue-200 rounded-md p-2" />

            <p className="font-semibold text-sm md:text-lg text-gray-600">
              No Tasks have been added to this epic yet
            </p>

            <button
              onClick={() =>
                navigate(`/projects/${projectId}/tasks/new`, {
                  state: { epicId: epic.id }
                })
              }
              className="bg-blue-darkBlue hover:bg-blue-700 rounded-lg text-brightness-secondary text-sm md:text-lg cursor-pointer px-2 py-1 md:px-5 md:py-2 transition"
            >
              Create New Task
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse px-4">
                <tbody>
                  {data.map((task) => {
                    console.log(data);
                    const assigneeInitials = getInitials(task.assignee?.name || "Unassigned");

                    const bgColor = getAvatarColor(task.assignee?.name);

                    return (
                      <tr key={task.id} className="bg-blue-100">
                        <td className="p-4 flex items-center gap-2">
                          <CheckCircle2 size={20} className="text-blue-darkBlue hidden md:block" />
                          <span>
                            <p className="font-medium text-gray-800 truncate">{task.title}</p>
                            <div className="flex items-center gap-2">
                              {task.assignee?.avatar ? (
                                <img
                                  src={task.assignee.avatar}
                                  alt={task.assignee.avatar}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <span
                                  className={`${bgColor} text-white text-[8px] rounded-full p-1`}
                                >
                                  {assigneeInitials}
                                </span>
                              )}

                              <p className="text-xs text-gray-500">
                                {task.assignee?.name || "Unassigned"}
                              </p>
                            </div>
                          </span>
                        </td>
                        <td className="p-1 text-gray-600">
                          <p className="text-[10px] text-gray-500">DUE DATE</p>
                          <p className="text-xs text-gray-600">{formatedDate(task.due_date)}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              onClick={() =>
                navigate(`/projects/${projectId}/tasks/new`, {
                  state: { epicId: epic.id }
                })
              }
              className="md:hidden w-full border border-dashed border-gray-600 mt-10 text-gray-600 rounded-lg py-2 flex items-center justify-center gap-2"
            >
              <PlusCircle size={20} />
              ADD NEW TASK
            </button>
          </>
        )}
      </div>
    </div>
  );
}
