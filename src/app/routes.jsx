import { createBrowserRouter } from "react-router";
import { AdminLayout } from "./components/AdminLayout";
import { BoardGamesPage } from "./components/BoardGamesPage";
import { UsersPage } from "./components/UsersPage";
import { LoginPage } from "./components/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <BoardGamesPage /> },
      { path: "users", element: <UsersPage /> },
    ],
  },
]);
