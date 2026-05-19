import React from "react";
import { motion } from "framer-motion";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/API/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { addProjectSchema } from "@/Schema/AddNewProject";
import { CheckCircle } from "lucide-react";
import { FaStarOfLife } from "react-icons/fa";

type FormData = z.infer<typeof addProjectSchema>;

export default function AddNewProject() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(addProjectSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await api.post(`/rest/v1/projects`, {
        name: data.title,
        description: data.description
      });

      if (response.status !== 201 && response.status !== 200) {
        toast.error("Failed to Create the Project");
        return;
      }
      toast.success("Project Created Successfully.");
      reset();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        toast.error(`Failed: ${error.response?.status} ${error.response?.data?.message || ""}`);
      } else {
        toast.error("Unknown Error Occurred");
      }
    }
  };
  return (
    <div className="px-2 py-6 md:py-12 md:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mx-auto mb-2 text-sm">
          <Link to={"/projects"} className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>
          <span className="cursor-pointer text-blue-darkBlue">Create New Project</span>
        </div>

        <h1 className="font-bold text-xl md:text-3xl text-gray-800">Add New Project</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-brightness-light rounded-md px-2 md:p-6"
      >
        <form
          className="w-full bg-brightness-primary py-6 px-5 md:py-8 md:px-6 rounded-md shadow-2xl"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <span className="flex items-center gap-2 mb-6">
            <CheckCircle size={40} className="text-blue-800 bg-blue-50 p-2 hidden md:block" />
            <span className="flex flex-wrap max-w-md">
              <h2 className="text-xl md:text-2xl font-semibold text-blue-darkBlue">
                Initialize New Project
              </h2>
              <p className="text-gray-500 text-xs md:text-sm">
                Define the scope and foundational details for your project
              </p>
            </span>
          </span>

          <div className="space-y-2 mb-5">
            <span className="flex items-center gap-1">
              <label className="text-sm" htmlFor="title">
                TITLE
              </label>
              <FaStarOfLife className="text-red-400" size={10} />
            </span>
            <input
              type="text"
              id="title"
              {...register("title")}
              className="w-full bg-blue-formBlue rounded-md px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="E.g. Design System Documentation"
            />
            {errors.title && <p className="text-red-600 text-sm mb-4">{errors.title.message}</p>}
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
                {...register("description")}
                placeholder="Provide a high level overview of the project's architectural objectives and key milestones..."
                className="w-full bg-blue-formBlue rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <p className="text-xs font-light flex justify-end text-gray-400">0/500 Characters</p>
            </span>
            {errors.description && (
              <p className="text-red-600 text-sm mb-4">{errors.description.message}</p>
            )}
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
