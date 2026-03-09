import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import { useLoginStatusQuery } from "./api/queries/auth";
import { useAuthStore } from "./store/auth";
import AuthGuard from "./components/AuthGuard";
import Loader from "./components/ui/Loader";
import Home from "./pages/Home";
import { useWebSocket } from "./hooks/useWebSocket";

function App() {
  const { isLoading } = useLoginStatusQuery();
  const { isLogged } = useAuthStore();
  const ws = useWebSocket();

  console.log(ws);

  if (isLoading) {
    return <Loader text="Verifying session..." />;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={isLogged ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isLogged ? <Navigate to="/home" replace /> : <Register />}
        />

        <Route element={<AuthGuard />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
