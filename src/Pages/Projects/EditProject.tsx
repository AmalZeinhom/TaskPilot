import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../API/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle } from "lucide-react";
import { FaStarOfLife } from "react-icons/fa";

export default function EditProject() {
  const { projectId } = useParams<{ projectId: string }>();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProjectData() {
      try {
        const response = await api.get(`/rest/v1/projects?id=eq.${projectId}`);

        if (response.data.length > 0) {
          const project = response.data[0];
          setTitle(project.name);
          setDescription(project.description);
        }
      } catch (error: any) {
        toast.error("Failed to load project data");
        console.log(error);
      }
    }

    fetchProjectData();
  }, [projectId]);

  async function updateProjectData(e: any) {
    e.preventDefault();

    try {
      const response = await api.patch(`/rest/v1/projects?id=eq.${projectId}`, {
        name: title,
        description
      });

      if (response.status === 401) {
        toast.error("Something Went Wrong!");
      }
      toast.success("Project Updated Successfully.");
      navigate("/projects");
    } catch (error: any) {
      toast.error("Update failed!");
      console.log(error);
    }
  }
  return (
    <div className="px-2 py-6 md:py-12 md:px-6 lg:px-8 lg:py-4">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mx-auto mb-2 text-sm">
          <Link to={"/projects"} className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>

          <span className="cursor-pointer text-blue-800">Edit Project</span>
        </div>

        <h1 className="font-bold text-xl md:text-3xl text-gray-800">Edit Project</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-brightness-light rounded-md px-3 py-5 md:px-8 md:py-10"
      >
        <form
          className="w-full bg-brightness-primary py-6 px-4 md:py-8 md:px-6 rounded-md shadow-2xl"
          noValidate
          onSubmit={updateProjectData}
        >
          <span className="flex items-center gap-2 mb-6">
            <CheckCircle size={40} className="text-blue-800 bg-blue-50 p-2 hidden md:block" />
            <span className="flex flex-wrap max-w-md">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-darkBlue">Edit Project</h2>
              <p className="text-gray-500 text-xs md:text-sm">
                Define the scope and foundational details for your project
              </p>
            </span>
          </span>

          <div className="space-y-2 mb-5">
            <span className="flex items-center gap-1">
              <label className="text-sm" htmlFor="project-title">
                TITLE
              </label>
              <FaStarOfLife className="text-red-400" size={10} />
            </span>
            <input
              type="text"
              id="project-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-blue-formBlue rounded-md px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="E.g. Design System Documentation"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm">
              DESCRIPTION
              <p className="text-xs font-light text-gray-400 mb-1">Optional</p>
            </label>
            <span>
              <textarea
                id="description"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a high level overview of the project's architectural objectives and key milestones..."
                className="w-full bg-blue-formBlue rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <p className="text-xs font-light flex justify-end text-gray-400">0/500 Characters</p>
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto bg-blue-darkBlue text-white font-semibold px-6 py-2 rounded-md shadow-2xl transition-colors duration-300 ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-cyan-800"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(`/projects`)}
              className="w-full sm:w-auto px-6 py-1 rounded-md bg-gray-200"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
