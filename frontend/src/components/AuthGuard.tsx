import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const AuthGuard = () => {
  const { isLogged } = useAuthStore();

  if (!isLogged) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
