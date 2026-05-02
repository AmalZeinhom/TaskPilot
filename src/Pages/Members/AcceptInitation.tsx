import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import { MdOutlineFolderShared } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAcceptInvitation from "@/hooks/useAcceptInvitation";
import Cookies from "js-cookie";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

export default function InvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const { accept, loading } = useAcceptInvitation();

  const accessToken = Cookies.get("access_token"); // Check Authorization

  // The destination where the user should go
  const redirectUrl = useMemo(() => {
    return `/invite?token=${token}`;
  }, [token]);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid Invitation Link");
      navigate("/login", { replace: true });
      return;
    }
    // If the user notauthenticated, use (redirect) to Save the main destination during user login
    if (!accessToken) {
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`); // encode To read the redirect + the token
    }
  }, [token, accessToken, navigate, redirectUrl]); // Dependency array, means re-turn the  effect when one of these elements changes

  const handleAccept = async () => {
    if (!token) return;

    const result = await accept(token);

    if (result === true) {
      // redirect after success
      navigate("/projects", { replace: true });
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 px-4">
      <div className="flex items-center gap-2 mb-7">
        <img src={logo} className="w-4 md:w-6 h-auto" alt="Task Tracker" />
        <h1 className="text-blue-950 text-sm md:text-lg font-semibold">TASKPILOT</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white shadow-xl rounded-md max-w-lg w-full py-10 px-8 space-y-8"
      >
        <div className="bg-gray-200 rounded-lg flex justify-center items-center gap-2 max-w-[250px] mx-auto">
          <MdOutlineFolderShared className="text-gray-500" />
          <p className="text-sm text-gray-700 font-semibold">New Project Invitation</p>
        </div>

        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800">
          You&apos;ve been invited to join project
        </h2>

        <div className="bg-blue-100 rounded-md px-5 py-3 flex justify-around items-center">
          <div className="bg-blue-200 text-blue-800 font-semibold p-2 rounded-lg">AM</div>
          <div className="flex flex-col text-lg text-gray-800 font-semibold text-center">
            <p>Amal Nasr</p>
            <p>Software Engineer</p>
          </div>
          <div className="bg-blue-200 text-blue-950 p-2 rounded-lg">Inviter</div>
        </div>

        <button
          type="submit"
          onClick={handleAccept}
          disabled={loading}
          className={`w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Accepting..." : "Accept Invitation"}
        </button>
      </motion.div>
    </div>
  );
}
