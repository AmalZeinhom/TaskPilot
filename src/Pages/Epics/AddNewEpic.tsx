import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CustomDatePicker from "@/Utils/DatePicker";
import { FaStarOfLife } from "react-icons/fa";
import useProjectName from "@/hooks/useProjectName";
import Selector from "@/Utils/Selector";
import { epicSchema } from "@/Schema/EpicSchema";
import useFetchMembers from "@/hooks/useFetchMembers";
import { createEpicService } from "@/API/epicService";

type FormData = z.infer<typeof epicSchema>;

export default function AddNewEpic() {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);

  const navigate = useNavigate();

  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);

  const { fetchAssignees } = useFetchMembers(setAssigneeOptions);

  if (!projectId) {
    toast.error("Project ID is missing!");
    return null;
  }

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(epicSchema),
    defaultValues: {
      title: "",
      description: "",
      assignee: null,
      deadline: undefined
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createEpicService({
        title: data.title,
        description: data.description,
        assignee_id: data.assignee,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        project_id: projectId
      });

      toast.success("Epic Created Successfully");

      reset();
    } catch (error: any) {
      toast.error(`Failed: ${error.response?.status} ${error.response?.data?.message || ""}`);
    }
  };

  useEffect(() => {
    fetchAssignees();
  }, [projectId]);

  return (
    <div className="flex justify-center items-center md:py-6 md:px-4 px-2">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-brightness-light rounded-2xl md:p-8 lg:p-6 p-4"
      >
        <div className="flex flex-wrap gap-2 mx-auto mb-6 text-sm">
          <Link to={"/projects"} className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>
          <Link
            to={`/projects/${projectId}/edit-project`}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {projectName} /
          </Link>
          <Link to={`/projects/${projectId}/epics`} className="text-gray-500 hover:text-gray-700">
            Epics /
          </Link>

          <span className="text-blue-darkBlue font-medium">Create New Epic</span>
        </div>

        <form
          className="w-full bg-brightness-primary md:py-10 md:px-5 py-8 px-4 rounded-md shadow-2xl space-y-6"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
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
                rows={4}
                {...register("description")}
                placeholder="Descripe the scope and objectives of this epic..."
                className="w-full bg-blue-formBlue rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <p className="text-xs font-light flex justify-end text-gray-400">0/500 Characters</p>
            </span>
            {errors.description && (
              <p className="text-red-600 text-sm mb-4">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm">ASSIGNEE</p>
              <Controller
                control={control}
                name="assignee"
                render={({ field }) => (
                  <Selector
                    options={assigneeOptions}
                    value={assigneeOptions.find((m) => m.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    placeholder="Select a Team Member"
                    className="bg-blue-formBlue rounded-md"
                    controlBg="bg-blue-formBlue rounded-md"
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm">DUE DATE</p>
              <Controller
                control={control}
                name="deadline"
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value ? new Date(field.value) : null}
                    onDateChange={(date) => field.onChange(date ? date.toISOString() : null)}
                    className="bg-blue-formBlue rounded-md"
                    inputClassName="bg-blue-formBlue rounded-md"
                  />
                )}
              />
            </div>
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
              {isSubmitting ? "Creating..." : "Create Epic"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate(`/projects/${projectId}/epics`)}
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
