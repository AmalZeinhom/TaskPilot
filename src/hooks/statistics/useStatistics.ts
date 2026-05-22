import { getCalendarStats, getProjectTasksCount } from "@/API/statistics";
import { CalendarStatsResponse, ProjectTasksCount } from "@/Types/statistics";
import { useEffect, useState } from "react";

export default function useStatistics(filters: {
  startDate: string;
  endDate: string;
  projectId: string | null;
  status: string | null;
}) {
  const [calendarStats, setCalendarStats] = useState<CalendarStatsResponse | null>(null);

  const [projectsStats, setProjectsStats] = useState<ProjectTasksCount[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [calendarRes, projectsRes] = await Promise.all([
          getCalendarStats({
            p_start_date: filters.startDate,
            p_end_date: filters.endDate,
            p_project_id: filters.projectId,
            p_status: filters.status
          }),

          getProjectTasksCount({
            p_start_date: filters.startDate,
            p_end_date: filters.endDate
          })
        ]);

        setCalendarStats(calendarRes);

        setProjectsStats(projectsRes);
      } catch (err) {
        console.log(err);

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.startDate, filters.endDate, filters.projectId, filters.status]);

  return {
    calendarStats,
    projectsStats,
    loading,
    error
  };
}
