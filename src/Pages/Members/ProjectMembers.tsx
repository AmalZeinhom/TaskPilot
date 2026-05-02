import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProjectMemberSkeleton from "@/Common/ProjectMemberSkeleton";
import { getInitials } from "@/Utils/GetInitials";
import { getAvatarColor } from "@/Utils/GetAvatarColor";
import Selector from "@/Utils/Selector";
import { roleOptions } from "@/Constants/roleOptions";
import InviteMembersModal from "./InviteMembersModal";
import { useProjectMembers } from "@/hooks/useProjectMembers";

export default function ProjectMembers() {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const { projectId } = useParams();

  const { members, loading, updateMemberRole } = useProjectMembers(projectId);

  const isEmpty = !loading && members.length === 0;

  if (loading) {
    return (
      <div className="mt-20">
        <ProjectMemberSkeleton />
        <ProjectMemberSkeleton />
        <ProjectMemberSkeleton />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-brightness-light rounded-lg mt-20 p-10 shadow-md">
        <div className="w-full flex justify-center flex-col items-center bg-brightness-primary py-10 px-5 sm:py-8 sm:px-6 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">No Members Found</h2>
          <p className="text-gray-600 mb-6">No members in this project yet.</p>
          <Link
            to="/invite-members"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Invite Members
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-7xl bg-brightness-light rounded-2xl p-4 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex flex-wrap gap-2 text-sm">
            <Link to={"/projects"} className="cursor-pointer text-gray-500 hover:text-gray-700">
              Projects /
            </Link>
            <span className="cursor-pointer text-gray-500 hover:text-gray-700">
              Project Members
            </span>
          </div>

          <button
            onClick={() => setInviteOpen(true)}
            className="w-full sm:w-auto bg-blue-darkBlue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 text-center"
          >
            Invite Members
          </button>
        </motion.div>

        <div className="w-full bg-brightness-primary py-8 px-5 md:py-10 md:px-6 rounded-2xl shadow-2xl">
          <div>
            <h2 className="text-lg md:text-2xl font-semibold text-blue-darkBlue mb-2 text-start">
              Project Members
            </h2>
            <p className="text-sm md:text-base text-gray-500 mb-6 text-start">
              Invite your team members to collaborate on this project.
            </p>
          </div>

          {members.map((member: any) => (
            <div
              key={member.member_id}
              className="flex items-center justify-between bg-white rounded-lg p-4 mb-4 shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
                <div className="flex items-center gap-4">
                  <span
                    className={`${getAvatarColor(member.metadata.name)} text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-lg font-semibold`}
                  >
                    {getInitials(member.metadata.name)}
                  </span>
                  <span className="flex flex-col">
                    <p className="text-sm md:text-base font-semibold text-darkness-dark ">
                      {member.metadata.name}
                    </p>
                    <p className="text-sm md:text-md text-gray-400">{member.email}</p>
                  </span>
                </div>

                <div className="relative flex items-center gap-2">
                  <Selector
                    options={roleOptions}
                    value={roleOptions.find((o) => o.value === member.role) || null}
                    onChange={(option) => {
                      if (!option?.value) return;

                      updateMemberRole(member.member_id, option.value);
                    }}
                  />

                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-darkness-dark">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <InviteMembersModal isOpen={isInviteOpen} onClose={() => setInviteOpen(false)} />
      </motion.div>
    </div>
  );
}
