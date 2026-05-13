import { TaskStatusType } from "./taskStatus";

export const statusColors: any = {
  TO_DO: "bg-gray-200 text-gray-700",
  IN_PROGRESS: "bg-blue-500 text-white",
  BLOCKED: "bg-red-500 text-white",
  IN_REVIEW: "bg-yellow-500 text-white",
  READY_FOR_QA: "bg-gray-700 text-white",
  REOPENED: "bg-indigo-500 text-white",
  READY_FOR_PRODUCTION: "bg-purple-500 text-white",
  DONE: "bg-green-600 text-white"
};

export type StatusSelectColor = {
  bg: string;
  text: string;
};

export const statusSelectColors: Record<TaskStatusType, StatusSelectColor> = {
  TO_DO: {
    bg: "#e5e7eb",
    text: "#374151"
  },

  IN_PROGRESS: {
    bg: "#3b82f6",
    text: "#ffffff"
  },

  BLOCKED: {
    bg: "#ef4444",
    text: "#ffffff"
  },

  IN_REVIEW: {
    bg: "#eab308",
    text: "#ffffff"
  },

  READY_FOR_QA: {
    bg: "#374151",
    text: "#ffffff"
  },

  REOPENED: {
    bg: "#6366f1",
    text: "#ffffff"
  },

  READY_FOR_PRODUCTION: {
    bg: "#9333ea",
    text: "#ffffff"
  },

  DONE: {
    bg: "#16a34a",
    text: "#ffffff"
  }
};
