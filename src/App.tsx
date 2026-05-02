import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Pages/Home.js";
import { Toaster } from "react-hot-toast";
import { SignUp } from "@/Pages/Auth/SignUp";
import { LogIn } from "@/Pages/Auth/LogIn";
import { Dashboard } from "./Pages/Dashboard.js";
import { ForgetPassword } from "./Pages/Auth/ForgetPassword";
import { ResetPassword } from "@/Pages/Auth/ResetPassword";
import Layout from "./Components/Layout.js";
import AddNewProject from "./Pages/Projects/AddNewProject.js";
import ProjectsList from "./Pages/Projects/ListProjects.js";
import EditProject from "./Pages/Projects/EditProject.js";
import ProjectMembers from "./Pages/Members/ProjectMembers.js";
import AddNewEpic from "./Pages/Epics/AddNewEpic.js";
import Tasks from "./Pages/Tasks/CreateNewTask.js";
import ListEpics from "./Pages/Epics/ListEpics.js";
import BoardView from "./Pages/Tasks/BoardView.js";
import AcceptInitation from "./Pages/Members/AcceptInitation.js";

const routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />
      },
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/add-new-project",
        element: <AddNewProject />
      },
      {
        path: "/projects",
        element: <ProjectsList />
      },
      {
        path: "invite",
        element: <AcceptInitation />
      },
      {
        path: "/projects/:projectId",
        children: [
          {
            path: "edit-project",
            element: <EditProject />
          },
          {
            path: "members",
            element: <ProjectMembers />
          },

          {
            path: "epics",
            element: <ListEpics />
          },
          {
            path: "epics/new",
            element: <AddNewEpic />
          },
          {
            path: "tasks/new",
            element: <Tasks />
          },
          {
            path: "tasks",
            element: <BoardView />
          }
        ]
      }
    ]
  },

  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/login",
    element: <LogIn />
  },

  {
    path: "/forget-password",
    element: <ForgetPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }
]);

export default function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routes} />
    </div>
  );
}
