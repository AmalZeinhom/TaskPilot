import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@/Components/Pagination";
import { Task } from "@/Types/Tasks";
import { getInitials } from "@/Utils/GetInitials";
import { statusColors } from "@/Constants/statusColors";
import { MoreHorizontal, PlusCircle, MoreVertical } from "lucide-react";
import { formatedDate } from "@/Utils/FormatedDate";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import useFetchTasks from "@/hooks/useFetchTasks";

export default function ListView({ searchTerm }: { searchTerm: string }) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { tasks, loading, error, page, setPage, totalPages } = useFetchTasks(
    projectId,
    9,
    searchTerm,
    "pagination"
  );

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {[1, 2, 3].map((x) => (
          <div key={x} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Failed to load tasks</p>;
  }

  if (tasks.length === 0) {
    return (
      <>
        {searchTerm ? (
          "No tasks found matching your search"
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center gap-2">
            <p className="text-gray-600 text-lg mb-3">No tasks added yet!.</p>
            <Link
              to={`/projects/${projectId}/tasks/new`}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Create New Task
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-xl shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">TASK ID</th>
              <th className="px-4 py-3">TITLE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">DUE DATE</th>
              <th className="px-4 py-3">ASSIGNEE</th>
              <th className="px-4 py-3">
                <PlusCircle
                  size={22}
                  className="hover: cursor-pointer hover:text-blue-500 transition-all duration-200"
                  onClick={() => navigate(`/projects/${projectId}/tasks/new`)}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task: Task) => {
              const assigneeInitials = getInitials(task.assignee?.name || "Unassigned");
              const bgColor = getAvatarColor(task.assignee?.name);

              return (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-blue-600">{task.task_id}</td>

                  <td className="px-4 py-3 text-gray-700">{task.title}</td>

                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColors[task.status]}`}>
                      {task.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">{formatedDate(task.due_date)}</td>

                  <td className="px-4 py-3 flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-xs text-white font-semibold`}
                    >
                      {assigneeInitials}
                    </div>
                    <p className="text-gray-700">{task.assignee?.name || "Unassigned"}</p>
                  </td>

                  <td className="px-4 py-3 text-gray-400 cursor-pointer">
                    <MoreHorizontal size={18} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {tasks.map((task: Task) => {
          const initials = getInitials(task.assignee?.name || "Unassigned");
          const color = getAvatarColor(task.assignee?.name);

          return (
            <div
              key={task.id}
              className="bg-brightness-primary py-6 px-4 rounded-xl shadow-xl flex flex-col justify-between"
            >
              <div className="flex justify-between py-3">
                <h2 className="text-blue-600">{task.task_id}</h2>
                <span className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}>
                  {task.status}
                </span>
              </div>

              <h3 className="font-semibold text-gray-700 mb-2">{task.title}</h3>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 mt-2">
                  <p
                    className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs`}
                  >
                    {initials}
                  </p>
                  <div className="flex flex-col">
                    <p className="text-gray-500 text-sm">Due Date</p>
                    <p className="text-sm text-gray-500 font-semibold">
                      {formatedDate(task.due_date)}
                    </p>
                  </div>
                </div>
                <MoreVertical size={20} className="text-gray-500 cursor-pointer" />
              </div>
            </div>
          );
        })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}
