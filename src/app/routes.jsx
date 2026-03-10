import { createHashRouter } from "react-router";
import { AdminLayout } from "./components/AdminLayout";
import { BoardGamesPage } from "./components/BoardGamesPage";
import { UsersPage } from "./components/UsersPage";
import { LoginPage } from "./components/LoginPage";

export const router = createHashRouter([
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
