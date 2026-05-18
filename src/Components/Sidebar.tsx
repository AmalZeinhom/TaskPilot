import {
  Folder,
  ListChecks,
  Plus,
  CalendarCheck2,
  User2Icon,
  MessageCircleMore,
  LogOut
} from "lucide-react";
import { MdArrowForwardIos, MdOutlineArrowBackIosNew, MdOutlineAnalytics } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { showLogoutToast } from "@/Common/LogoutPopUp";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export default function Sidebar({
  isMobileOpen,
  setIsMobileOpen
}: {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (v: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const access_token = Cookies.get("access_token");

      if (access_token) {
        await fetch(`${supabaseUrl}/auth/v1/logout`, {
          method: "POST",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${access_token}`
          }
        });
      }

      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      navigate("/login");
    } catch {
      toast.error("Logout failed, please try again.");
    }
  };

  const menuItems = [
    {
      name: "Projects",
      icon: <Folder size={20} />,
      hasSubmenu: true,
      submenu: [
        { name: "Add New Project", icon: <Plus size={20} />, path: "/add-new-project" },
        { name: "Projects List", icon: <ListChecks size={20} />, path: "/projects" }
      ]
    },
    ...(projectId //This called spread operator, with condition, if there is a projectId then add the elements to the main menu.
      ? [
          {
            name: "Members",
            icon: <User2Icon size={20} />,
            path: `/projects/${projectId}/members`
          }
        ]
      : []),
    ...(projectId
      ? [
          {
            name: "Epics",
            icon: <MessageCircleMore size={20} />,
            path: `/projects/${projectId}/epics`
          }
        ]
      : []),
    ...(projectId
      ? [
          {
            name: "Tasks",
            icon: <CalendarCheck2 size={20} />,
            path: `/projects/${projectId}/tasks`
          }
        ]
      : []),
    { name: "My Statistics", icon: <MdOutlineAnalytics size={20} />, path: "/my-statistics" }
  ];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  useEffect(() => {
    if (projectId) setIsProjectsOpen(true);
  }, [projectId]);

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`bg-brightness-primary text-blue-darkBlue flex flex-col shadow-xl fixed lg:static top-14 lg:top-0 left-0 h-[calc(100vh-3.5rem)] lg:h-full
          transition-all duration-300
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 z-40`}
        aria-hidden={!isMobileOpen && typeof window !== "undefined" && window.innerWidth < 1024}
      >
        <nav className="mt-6 flex flex-col gap-2 px-3">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.path && !item.hasSubmenu ? (
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileOpen?.(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? "bg-blue-darkBlue text-white shadow-lg" : "hover:bg-blue-700 hover:text-white"}`
                  }
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ) : (
                <div
                  className="flex items-center gap-3 p-3 rounded-md hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
                  onClick={() => item.hasSubmenu && setIsProjectsOpen(!isProjectsOpen)}
                >
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </div>
              )}

              {item.hasSubmenu && isProjectsOpen && !isCollapsed && (
                <div className="ml-6 flex flex-col gap-1 mt-1">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileOpen?.(false);
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-md transition-colors ${isActive ? "bg-blue-500 text-white shadow-lg" : "hover:bg-blue-700 hover:text-white"}`
                      }
                    >
                      {sub.icon}
                      <span>{sub.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-16 -right-5 overflow-visible z-50 opacity-0 md:opacity-100">
          <button onClick={toggleSidebar} className="p-2 rounded-full bg-blue-darkBlue text-white">
            {isCollapsed ? <MdArrowForwardIos size={20} /> : <MdOutlineArrowBackIosNew size={20} />}
          </button>
        </div>

        <div className="absolute bottom-6 w-full px-3">
          <button
            onClick={() => showLogoutToast({ onConfirm: handleLogOut })}
            className="flex items-center gap-3 w-full p-3 rounded-md text-red-600 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
