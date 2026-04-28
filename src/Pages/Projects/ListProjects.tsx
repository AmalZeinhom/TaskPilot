import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ClipboardPenLine, X, PencilLine } from "lucide-react";
import { Project } from "@/Types/Project";
import Pagination from "@/Components/Pagination";
import { useProjects } from "@/hooks/useProjects";
import { useDeleteProject } from "@/hooks/useDeleteProject";

export default function ProjectsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromURL = Number(searchParams.get("page")) || 1;
  const { data, loading, error, totalPages, setData } = useProjects(9, pageFromURL);

  const navigate = useNavigate();
  const { deleteProject } = useDeleteProject(setData);

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
    return <p className="text-red-500">Failed to load projects</p>;
  }

  if (!loading && data.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2">
        <p className="text-gray-600 text-lg mb-3">No projects added yet!.</p>
        <Link
          to="/add-new-project"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Create New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto bg-brightness-light rounded-2xl p-4 sm:p-6 md:p-8"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 mb-6"
          >
            <h2 className="text-lg md:text-2xl font-semibold text-blue-darkBlue">
              Assigned Projects
            </h2>

            <Link
              to={"/add-new-project"}
              className="px-4 py-2 max-w-[55%] sm:max-w-[50%] bg-blue-darkBlue text-brightness-primary rounded-lg hover:bg-blue-800 transition"
            >
              Add New Project
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            {data.map((project: Project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/epics`)}
                className="cursor-pointer px-6 py-4 bg-brightness-primary shadow-lg rounded-2xl hover:shadow-xl transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <ClipboardPenLine size={20} className="text-gray-600 flex-shrink-0" />

                    <div className="flex flex-col min-w-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-blue-darkBlue mb-1 truncate">
                        {project.name}
                      </h2>

                      <p className="text-gray-500 text-xs">
                        {new Date(project.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-gray-700 text-sm mb-2 line-clamp-2 text-center">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-2">
                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "#3b82f6",
                        transition: { duration: 0.3 },
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}/edit-project`);
                      }}
                      className="p-2 bg-blue-400 text-white text-sm rounded-full mr-2"
                    >
                      <PencilLine size={20} />
                    </motion.button>

                    <motion.button
                      whileHover={{
                        scale: 1.1,
                        rotate: 90,
                        backgroundColor: "#dc2626",
                        transition: { duration: 0.3 },
                        cursor: "pointer"
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="p-2 bg-red-400 text-white text-sm rounded-full"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={pageFromURL}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            setSearchParams({ page: String(newPage) });
          }}
        />
      </motion.div>
    </div>
  );
}
