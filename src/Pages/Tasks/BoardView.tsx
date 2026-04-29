import { motion } from "framer-motion";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useProjectName from "@/hooks/useProjectName";
import { SearchIcon } from "lucide-react";
import { TaskStatus } from "@/Constants/taskStatus";
import Column from "./Components/Column";

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { useState } from "react";

import api from "@/API/axiosInstance";
import toast from "react-hot-toast";
import TaskCard from "./Components/TaskCard";
import Selector from "@/Utils/Selector";
import ListView from "./ListView";
import useFetchTasks from "@/hooks/useFetchTasks";

export default function BoardView() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);

  const [activeTask, setActiveTask] = useState<any>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get("view") || "board";

  const { tasks, hasMore, loadMore, updateTask, error, loading } = useFetchTasks(projectId);

  const options = [
    { label: "Board View", value: "board" },
    { label: "List View", value: "list" }
  ];

  const selectedOption = options.find((o) => o.value === view) || null;

  // Infinite scroll handler
  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;

    if (bottom && hasMore) {
      loadMore();
    }
  };

  function handleDragStart(event: any) {
    setActiveTask(event.active.data.current);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      await api.patch(`/rest/v1/tasks?id=eq.${taskId}`, {
        status: newStatus
      });

      updateTask(taskId, newStatus);

      toast.success("Task Updated Successfully");
    } catch (err: any) {
      toast.error("Failed to update task", err.message);
    }
  }

  if (error) {
    return <p className="text-red-500 mx-auto">Failed to load Tasks</p>;
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

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-[100dvh] flex flex-col px-1 md:px-6"
      >
        <div className="flex gap-2 text-sm mb-6">
          <Link to="/projects" className="text-gray-500">
            Projects /
          </Link>
          <Link to={`/projects/${projectId}`} className="text-gray-500">
            {projectName || projectId} /
          </Link>
          <span className="text-gray-700 font-medium">Tasks</span>
        </div>

        <div className="bg-white rounded-2xl shadow p-4 md:p-6 flex-1 flex flex-col ">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-5 mb-6">
            <div className="relative w-full md:w-80">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tasks"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="w-full md:w-80">
              <Selector
                options={options}
                value={selectedOption}
                onChange={(option) =>
                  setSearchParams({
                    view: option?.value?.toString() || "board"
                  })
                }
              />
            </div>
          </div>

          {view === "board" ? (
            <div
              onScroll={handleScroll}
              className="flex gap-4 overflow-y-auto flex-1 snap-x snap-mandatory scroll-smooth overscroll-x-contain touch-pan-x"
            >
              {TaskStatus.map((status) => (
                <div
                  key={status}
                  className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[360px] flex-shrink-0 snap-start"
                >
                  <Column status={status} tasks={tasks.filter((t) => t.status === status)} />
                </div>
              ))}
            </div>
          ) : (
            <ListView />
          )}
        </div>
      </motion.div>

      {/* Virtual Card for Drag Overlay */}
      <DragOverlay>{activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
    </DndContext>
  );
}
