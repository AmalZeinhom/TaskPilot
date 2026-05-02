import { Menu } from "lucide-react";
import logo from "../assets/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "@/Store/store";
import { getInitials } from "@/Utils/GetInitials";

export default function Navbar({ setIsMobileOpen }: { setIsMobileOpen?: (v: boolean) => void }) {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  // Present Naming for logged in users only.
  const initials = getInitials(user?.name);

  return (
    <nav className="w-full bg-brightness-primary shadow-xl py-3 sm:py-4 px-4 sm:px-6 md:px-12 flex items-center z-50">
      <div className="flex items-center gap-3 sm:gap-4 pl-0 sm:pl-6 flex-shrink-0">
        <button
          className="lg:hidden mr-2 p-2 rounded-md text-blue-darkBlue hover:bg-white/60"
          onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        <img src={logo} className="w-8 sm:w-10 h-auto" alt="Task Tracker" />
        <h1 className="hidden sm:block text-lg sm:text-xl md:text-2xl font-bold text-blue-darkBlue whitespace-nowrap">
          TaskPilot
        </h1>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="text-right hidden md:block min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-gray-600 truncate max-w-[140px] sm:max-w-[220px]">
            {loading ? "Loading..." : user?.name || "Guest"}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[140px] sm:max-w-[220px]">
            {loading ? "" : user?.job_title || ""}
          </p>
        </div>

        <div className="relative flex-shrink-0">
          <div className="bg-blue-900 text-white font-semibold w-9 h-9 rounded-full sm:w-10 sm:h-10 flex items-center justify-center text-base sm:text-lg focus:outline-none">
            {loading ? "..." : initials || "—"}
          </div>
        </div>
      </div>
    </nav>
  );
}
