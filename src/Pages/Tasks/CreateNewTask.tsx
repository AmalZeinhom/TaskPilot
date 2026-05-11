import api from "@/API/axiosInstance";
import CustomDatePicker from "@/Utils/DatePicker";
import Selector from "@/Utils/Selector";
import { statusOptions } from "@/Constants/taskStatus";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { FaStarOfLife } from "react-icons/fa";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import useProjectName from "@/hooks/useProjectName";
import { taskSchema } from "@/Schema/TaskSchema";
import useFetchMembers from "@/hooks/useFetchMembers";

import { createTaskService } from "@/API/taskService";

type FormData = z.infer<typeof taskSchema>;

export default function Tasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const preSelectedEpicId = (location.state as any)?.epicId || null;

  const [assigneeOptions, setAssigneeOptions] = useState<any[]>([]);
  const [epicOptions, setEpicOptions] = useState<any[]>([]);

  const [searchParams] = useSearchParams();
  const statusFormUrl = searchParams.get("status") as FormData["status"] | null;
  const projectName = useProjectName(projectId);

  const { fetchAssignees } = useFetchMembers(setAssigneeOptions);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project_id: projectId || "",
      epic_id: null,
      assignee_id: null,
      due_date: null,
      status: statusFormUrl || "TO_DO"
    }
  });

  useEffect(() => {
    if (preSelectedEpicId) {
      setValue("epic_id", preSelectedEpicId);
    }
  }, [preSelectedEpicId, setValue]);

  const titleTruncate = (title: string, maxLength = 100) =>
    title.length > maxLength ? title.slice(0, maxLength) + "..." : title;

  useEffect(() => {
    fetchAssignees();
  }, [projectId]);

  useEffect(() => {
    const fetchEpics = async () => {
      try {
        const res = await api.get(`/rest/v1/epics?project_id=eq.${projectId}`);

        const mapped = res.data.map((epic: any) => ({
          label: `${epic.epic_id} ${titleTruncate(epic.title)}`,
          value: epic.id
        }));

        setEpicOptions(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEpics();
  }, [projectId]);

  useEffect(() => {
    if (statusFormUrl) {
      setValue("status", statusFormUrl);
    }
  }, [statusFormUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await createTaskService({
        title: data.title,
        description: data.description,
        assignee_id: data.assignee_id,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
        epic_id: data.epic_id,
        status: data.status,
        project_id: projectId || ""
      });

      toast.success("Task Created Successfully");

      navigate(`/projects/${projectId}/tasks`);
    } catch (error: any) {
      toast.error(`Failed: ${error.response?.status} ${error.response?.data?.message || ""}`);
    }
  };

  return (
    <div className="flex justify-center items-center md:py-12 md:px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-4 md:p-10"
      >
        <div className="flex gap-2 mb-6 text-sm text-gray-500">
          <Link to="/projects" className="cursor-pointer text-gray-500 hover:text-gray-700">
            Projects /
          </Link>
          <Link
            to={`/projects/${projectId}`}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            {projectName} /
          </Link>
          <Link
            to={`/projects/${projectId}/tasks`}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            Tasks /
          </Link>
          <span>Create New</span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="w-full bg-brightness-primary md:py-10 md:px-5 py-8 px-4 rounded-2xl shadow-2xl space-y-6"
        >
          <div className="space-y-2">
            <span className="flex items-center gap-1">
              <label className="text-sm">TITLE</label>
              <FaStarOfLife className="text-red-400" size={10} />
            </span>
            <input
              {...register("title")}
              className="w-full bg-blue-formBlue rounded-md px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="E.g., Design System Documentation"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm">DESCRIPTION</label>
            <span>
              <textarea
                rows={4}
                {...register("description")}
                className="w-full bg-blue-formBlue rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Briefly describe the task scope..."
              />
              <p className="text-xs font-light flex justify-end text-gray-400">0/500 Characters</p>
            </span>
            {errors.description && (
              <p className="text-red-600 text-sm mb-4">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm">ASSIGNEE</p>
              <Controller
                control={control}
                name="assignee_id"
                render={({ field }) => (
                  <Selector
                    options={assigneeOptions}
                    value={assigneeOptions.find((o) => o.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    placeholder="Select a Team Member"
                    className="bg-blue-formBlue rounded-md"
                    controlBg="bg-blue-formBlue rounded-md"
                  />
                )}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <p className="text-sm">STATUS</p>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Selector
                    options={statusOptions()}
                    value={statusOptions().find((o) => o.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    className="bg-blue-formBlue rounded-md"
                    controlBg="bg-blue-formBlue rounded-md"
                  />
                )}
              />
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-2">
              <p className="text-sm">DUE DATE</p>
              <Controller
                control={control}
                name="due_date"
                render={({ field }) => (
                  <CustomDatePicker
                    selectedDate={field.value ? new Date(field.value) : null}
                    onDateChange={(date) => field.onChange(date ? date.toISOString() : null)}
                    className="bg-blue-formBlue rounded-md px-3"
                    inputClassName="bg-blue-formBlue rounded-md"
                  />
                )}
              />
            </div>

            {/* Epic */}
            <div className="flex flex-col gap-2">
              <p className="text-sm">EPIC</p>
              <Controller
                control={control}
                name="epic_id"
                render={({ field }) => (
                  <Selector
                    options={epicOptions}
                    value={epicOptions.find((o) => o.value === field.value) || null}
                    onChange={(val) => field.onChange(val?.value)}
                    placeholder="Select an Epic"
                    className="bg-blue-formBlue rounded-md"
                    controlBg="bg-blue-formBlue rounded-md"
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
              {isSubmitting ? "Creating..." : "Create Task"}
            </motion.button>

            <button
              type="button"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
              className="w-full sm:w-auto px-6 py-1 rounded-md bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
