import { useEffect, useMemo, useState } from "react";
import api from "@/API/axiosInstance";
import { ChevronLeft, ChevronRight, ClipboardList, CheckCircle, TriangleAlert } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2"; // Wrapper to integrate chart with react
import { statusOptions, TaskStatusType } from "@/Constants/taskStatus";
import { statusColors } from "@/Constants/statusColors";
import { formatedDate } from "@/Utils/FormatedDate";
import { Project } from "@/Types/Project";

// ArcElement for doughnut chart && Tooltip for hiver popup && Legent for labels
ChartJS.register(ArcElement, Tooltip, Legend);

type DailyTask = {
  day: string;

  // Partial means not all keys need to be presented && Record means an object with {key: value}
  statuses: Partial<Record<TaskStatusType, number>>;
};

type CalendarStatsResponse = {
  daily: DailyTask[];

  totals: Partial<Record<TaskStatusType, number>>;

  total_tasks: number;

  done_tasks: number;

  overdue_tasks: number;
};

type ProjectTasksCount = {
  project_id: string;

  project_name: string;

  tasks_count: number;
};

export function Statistics() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [calendarStats, setCalendarStats] = useState<CalendarStatsResponse | null>(null);
  const [projectsStats, setProjectsStats] = useState<ProjectTasksCount[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentWeek = () => {
    const now = new Date(); //current date

    const firstDay = new Date(now);

    const day = now.getDay(); //getDay is a method which returns the index of the day from a week 0 Sunday && 1 Monday

    firstDay.setDate(now.getDate() - day);

    const lastDay = new Date(firstDay);

    lastDay.setDate(firstDay.getDate() + 6);

    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0]
    };
  };

  const currentWeek = getCurrentWeek();

  const [startDate, setStartDate] = useState(currentWeek.start);
  const [endDate, setEndDate] = useState(currentWeek.end);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/rest/v1/rpc/get_projects");

        setProjects(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);

        setError("");

        //Promise.all makes the both APIs work Parallel
        const [calendarRes, projectsRes] = await Promise.all([
          api.post("/rest/v1/rpc/get_tasks_calendar_stats", {
            p_start_date: startDate,
            p_end_date: endDate,
            p_project_id: selectedProject,
            p_status: selectedStatus
          }),

          api.post("/rest/v1/rpc/get_tasks_count_per_project", {
            p_start_date: startDate,
            p_end_date: endDate
          })
        ]);

        setCalendarStats(calendarRes.data);

        setProjectsStats(projectsRes.data || []);
      } catch (err) {
        console.log(err);

        setError("Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [startDate, endDate, selectedProject, selectedStatus]);

  //Responsible for change the week
  const changeWeek = (direction: "next" | "prev") => {
    //instead of true || false, use next || prev form more clarity
    const start = new Date(startDate);

    const end = new Date(endDate);

    const amount = direction === "next" ? 7 : -7;

    start.setDate(start.getDate() + amount);

    end.setDate(end.getDate() + amount);

    setStartDate(start.toISOString().split("T")[0]);

    setEndDate(end.toISOString().split("T")[0]);
  };

  const chartData = useMemo(() => {
    const totals = calendarStats?.totals || {};

    return {
      //Object.key to get ["TO_DO", "IN_PROGRESS", "DONE"]
      labels: Object.keys(totals).map((status) => status.replaceAll("_", " ")),

      datasets: [
        {
          //Object.value to get [5, 7, 3]
          data: Object.values(calendarStats?.totals || {}),

          backgroundColor: [
            "#9CA3AF",
            "#3B82F6",
            "#EF4444",
            "#F59E0B",
            "#374151",
            "#6366F1",
            "#9333EA",
            "#16A34A"
          ],

          borderWidth: 0
        }
      ]
    };
  }, [calendarStats]);

  //To convert 2026-05-14 to Thu 14 May
  const formatCalendarDay = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);

    // create LOCAL-safe date (not UTC)
    const parsedDate = new Date(y, m - 1, d);

    return {
      day: parsedDate.toLocaleDateString("en-US", {
        weekday: "short"
      }),

      date: parsedDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short"
      })
    };
  };

  const isToday = (date: string) => {
    const today = new Date();

    const [y, m, d] = date.split("-").map(Number);
    const compare = new Date(y, m - 1, d);

    return (
      today.getFullYear() === compare.getFullYear() &&
      today.getMonth() === compare.getMonth() &&
      today.getDate() === compare.getDate()
    );
  };

  return (
    <section className="px-3 py-4 md:px-6 md:py-6 bg-[#F8FAFC] min-h-screen space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-darkness-textBlack">Weekly Planner</h1>

        <p className="text-sm text-gray-500 mt-1">Manage your deadlines and track team velocity.</p>
      </div>

      {/* FILTERS */}
      <div className="bg-blue-100 rounded-md p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        {/* DATE RANGE */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center justify-between gap-4 w-full xl:w-fit">
          <button onClick={() => changeWeek("prev")}>
            <ChevronLeft size={18} className="text-darkness-textBlack" />
          </button>

          <p className="text-sm font-semibold text-darkness-textBlack whitespace-nowrap">
            {formatedDate(startDate)} - {formatedDate(endDate)}
          </p>

          <button onClick={() => changeWeek("next")}>
            <ChevronRight size={18} className="text-darkness-textBlack" />
          </button>
        </div>

        {/* SELECTORS */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* PROJECTS */}
          <select
            value={selectedProject || ""}
            onChange={(e) => setSelectedProject(e.target.value || null)}
            className="bg-white rounded-md px-4 py-3 text-sm outline-none min-w-[200px]"
          >
            <option value="">All Projects</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            value={selectedStatus || ""}
            onChange={(e) => setSelectedStatus(e.target.value || null)}
            className="bg-white rounded-md px-4 py-3 text-sm outline-none min-w-[200px]"
          >
            <option value="">All Statuses</option>

            {statusOptions().map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 flex justify-center items-center text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TOTAL */}
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">TOTAL TASKS</p>

            <h2 className="text-4xl font-bold text-darkness-textBlack mt-2">
              {calendarStats?.total_tasks || 0}
            </h2>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl">
            <ClipboardList size={24} className="text-blue-700" />
          </div>
        </div>

        {/* DONE */}
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">COMPLETED TASKS</p>

            <h2 className="text-4xl font-bold text-darkness-textBlack mt-2">
              {calendarStats?.done_tasks || 0}
            </h2>
          </div>

          <div className="bg-green-50 p-3 rounded-xl">
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        {/* OVERDUE */}
        <div className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] text-gray-400 font-semibold">OVERDUE TASKS</p>

            <h2 className="text-4xl font-bold text-red-600 mt-2">
              {calendarStats?.overdue_tasks || 0}
            </h2>
          </div>

          <div className="bg-red-50 p-3 rounded-xl">
            <TriangleAlert size={24} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl min-h-[250px] animate-pulse" />
            ))
          : calendarStats?.daily?.map((dayItem) => {
              const formattedDay = formatCalendarDay(dayItem.day);

              const statuses = Object.entries(dayItem.statuses || {});

              const today = isToday(dayItem.day);

              return (
                <div
                  key={dayItem.day}
                  className={`
                    bg-white rounded-2xl p-4 min-h-[350px]
                    ${today ? "border-2 border-blue-darkBlue" : ""}
                  `}
                >
                  {/* TODAY */}
                  {today && (
                    <div className="relative">
                      <span className="absolute -top-7 translate-x-6 bg-blue-darkBlue text-white text-[10px] font-semibold px-3 py-1 rounded-full">
                        TODAY
                      </span>
                    </div>
                  )}

                  {/* DAY */}
                  {statuses.length === 0 ? (
                    <>
                      <p className="text-xs uppercase text-gray-400 font-semibold">
                        {formattedDay.day}
                      </p>

                      <h3 className="text-xl font-bold text-gray-500 mt-1">{formattedDay.date}</h3>
                    </>
                  ) : (
                    <>
                      <p className="text-xs uppercase text-gray-400 font-semibold">
                        {formattedDay.day}
                      </p>

                      <h3 className="text-xl font-bold text-darkness-Black mt-1">
                        {formattedDay.date}
                      </h3>
                    </>
                  )}

                  {/* TASKS */}
                  <div className="mt-4 flex flex-col gap-2">
                    {statuses.length > 0 ? (
                      statuses.map(([status, count]) => (
                        <div
                          key={status}
                          className={`rounded-sm px-3 py-2 flex items-center justify-between text-xs font-semibold ${
                            statusColors[status as TaskStatusType]
                          }`}
                        >
                          <span>{status.replaceAll("_", " ")}</span>

                          <span>{count}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-[120px]">
                        <p className="text-xs text-gray-300 font-semibold">No Tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* CHART */}
        <div className="bg-white rounded-2xl p-5 min-h-[350px] shadow-xl">
          <h3 className="text-xl font-bold text-darkness-textBlack mb-6">Tasks by Status</h3>

          <div className="max-w-[350px] mx-auto">
            <Doughnut data={chartData} />
          </div>
        </div>

        {/* PROJECTS */}
        <div className="bg-white rounded-2xl p-5 min-h-[350px] shadow-sm">
          <h3 className="text-xl font-bold text-darkness-textBlack mb-6">All Projects</h3>

          <div className="flex flex-col gap-3">
            {projectsStats.map((project) => (
              <div
                key={project.project_id}
                className="border border-gray-100 rounded-xl px-4 py-4 flex items-center justify-between shadow-xl"
              >
                <div>
                  <p className="text-sm uppercase font-semibold text-darkness-textBlack">
                    {project.project_name}
                  </p>
                </div>

                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {project.tasks_count} Tasks
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
