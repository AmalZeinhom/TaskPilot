import Modal from "@/Components/Modal";
import useProjectName from "@/hooks/useProjectName";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { UserPlusIcon, XIcon } from "lucide-react";
import { MdOutlineEmail } from "react-icons/md";
import { InviteMembersModalProps } from "@/Types/InviteMembers";
import { inviteSchema } from "@/Schema/InviteMembers";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/API/axiosInstance";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

type InviteForm = z.infer<typeof inviteSchema>;

export default function InviteMembersModal({ isOpen, onClose }: InviteMembersModalProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const projectName = useProjectName(projectId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<InviteForm>({ resolver: zodResolver(inviteSchema) });

  const onSubmit = async (data: InviteForm) => {
    const { email } = data;

    if (!projectId) {
      toast.error("Invalid project");
      return;
    }

    try {
      await api.post(`/rest/v1/rpc/invite_member`, {
        p_email: email,
        p_project_id: projectId,
        p_app_url: window.location.origin, //Return the main app domain without any path. ex. http://localhost:5173
        p_base_url: supabaseUrl
      });

      toast.success("Invitation Sent Successfully");
      onClose(); // Close form after submitting
    } catch (err: any) {
      console.log(err);
      console.log("Error response data:", err.response?.data);
      toast.error("Something went wrong, Try again later!");
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-brightness-primary py-8 px-6 md:py-6 md:px-4 w-full rounded-md shadow-xl space-y-4 md:min-w-[400px]"
      >
        <div className="flex justify-between items-center">
          <span className="bg-blue-300/60 p-2 rounded-lg">
            <UserPlusIcon size={18} className="text-blue-darkBlue" />
          </span>
          <button onClick={onClose}>
            <XIcon size={18} className="text-gray-400 " />
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="font-bold text-lg text-gray-600">Invite Team Members</h2>
          <p className="text-xs text-gray-400">
            Send an invitation to join the {projectName || "Your"} workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-gray-400">EMAIL ADDRESS</p>
            <div className="relative">
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email address"
                className="bg-blue-formBlue w-full rounded-md py-1 px-3 relative focus:outline-blue-400"
              />
              <MdOutlineEmail
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col w-full md:grid md:grid-cols-2 py-2 px-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-lightBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </Modal>
  );
}
