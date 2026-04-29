import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "../../API/axiosInstance";
import CustomDatePicker from "@/Utils/DatePicker";

const schema = z.object({
  title: z
    .string()
    .min(1, { message: "Epic Title is required!" })
    .min(3, { message: "Epic Title must be at least 3 characters" })
    .max(50, { message: "Epic Title must be at most 50 characters" })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces"
    }),
  description: z
    .string()
    .max(500, { message: "Message must be at most 500 characters" })
    .optional(),
  assignee: z.string().optional(),
  deadline: z
    .date()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return val >= today;
      },
      { message: "Deadline cannot be in the past" }
    )
});

type FormData = z.infer<typeof schema>;

interface Member {
  member_id: string;
  user_id: string;
  metadata: {
    name: string;
    email: string;
  };
}

export default function AddNewEpic() {
  const params = useParams();
  const projectId = params.projectId as string | undefined;
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);

  if (!projectId) {
    toast.error("Project ID is missing!");
    return null;
  }
  const projectName = new URLSearchParams(window.location.search).get("projectName") || "Project";

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      deadline: undefined
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (!accessToken) {
        toast.error("User not authenticated!");
        return;
      }

      const response = await api.post(`/rest/v1/epics`, {
        title: data.title,
        description: data.description,
        assignee_id: data.assignee,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        project_id: projectId
      });

      if (response.status !== 201 && response.status !== 200) {
        toast.error("Failed to Create the Epic");
        return;
      }

      toast.success("Epic Created Successfully.");
      reset();
    } catch (error: any) {
      toast.error(`Failed: ${error.response?.status} ${error.response?.data?.message || ""}`);
    }
  };

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const accessToken = Cookies.get("access_token");
        if (!accessToken) {
          toast.error("Member Not Authorized!");
          return;
        }

        const response = await api.get(`/rest/v1/get_project_members?project_id=eq.${projectId}`);

        setMembers(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchProjectMembers();
  }, [projectId]);

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-8 sm:p-8 md:p-10"
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
          className="w-full bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-2xl shadow-2xl"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className="w-full min-h-11 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />
          {errors.title && <p className="text-red-600 text-sm mb-4">{errors.title.message}</p>}

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full min-h-28 sm:min-h-32 border-2 border-gray-400 rounded-xl focus:shadow-xl focus:border-gray-500 outline-none px-3 py-2 mt-2 mb-5"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mb-4">{errors.description.message}</p>
          )}

          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <label htmlFor="assignee">Assign to</label>

              <div className="relative w-full sm:w-[25%] mt-2">
                <select
                  {...register("assignee")}
                  id="assignee"
                  className="w-full h-11 border-2 border-gray-400 rounded-xl px-3 pr-10 appearance-none focus:shadow-xl focus:border-gray-500 outline-none"
                >
                  <option value="">Select Assignee</option>

                  {members.map((member) => (
                    <option key={member.member_id} value={member.user_id}>
                      {member.metadata.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={20}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                />
              </div>

              {errors.assignee && (
                <p className="text-red-600 text-sm mt-1">{errors.assignee.message}</p>
              )}
            </div>

            <div>
              <label>Deadline</label>

              <div className="mt-2 w-full sm:w-[25%]">
                <Controller
                  name="deadline"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      selectedDate={field.value ?? null}
                      onDateChange={field.onChange}
                    />
                  )}
                />
              </div>

              {errors.deadline && (
                <p className="text-red-600 text-sm mt-1">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto bg-blue-darkBlue text-white font-semibold px-6 py-2 rounded-xl shadow-2xl transition-colors duration-300 ${
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
              className="w-full sm:w-auto bg-blue-lightBlue text-white font-semibold px-6 py-2 rounded-xl shadow-2xl hover:bg-cyan-800 transition-colors duration-300"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
