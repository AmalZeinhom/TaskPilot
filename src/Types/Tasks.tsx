export type Task = {
  id: string;
  task_id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  project_id: string;
  assignee: {
    id: string;
    name: string;
    email: string;
    department: string;
    avatar?: string | null;
  } | null;
};
