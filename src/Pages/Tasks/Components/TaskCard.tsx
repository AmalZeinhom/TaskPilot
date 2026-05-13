import { MoreHorizontal, Clock } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { formatedDate } from "@/Utils/FormatedDate";
import { getInitials } from "@/Utils/GetInitials";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import { Task } from "@/Types/Tasks";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onClick?: () => void;
}

export default function TaskCard({ task, isOverlay = false, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
    data: task,
    disabled: isOverlay // Disable dragging when it's the overlay
  });

  const assigneeInitials = getInitials(task.assignee?.name || "Unassigned");
  const avatarColor = getAvatarColor(task.assignee?.name);

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`bg-white flex flex-col justify-between border min-h-[140px] border-gray-200 rounded-lg p-4 shadow-sm transition ${
        !isOverlay ? "hover:shadow-md cursor-grab" : "shadow-lg opacity-90"
      }`}
    >
      <div
        {...(!isOverlay ? listeners : {})}
        {...(!isOverlay ? attributes : {})}
        className="cursor-grab"
      >
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
          <MoreHorizontal size={16} className="text-gray-400 cursor-pointer" />
        </div>

        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{task.description}</p>
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-400 text-xs">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{formatedDate(task.due_date)}</span>
        </div>

        <div
          className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs text-white font-semibold`}
        >
          {assigneeInitials}
        </div>
      </div>
    </div>
  );
}
