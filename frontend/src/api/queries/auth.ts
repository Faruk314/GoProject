import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "../../utils/error";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { login, register, getLoginStatus, logout } from "../services/auth";
import { useToast } from "../../hooks/useToast";

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { setLoginStatus, setLoggedUser } = useAuthStore();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setLoggedUser(data.userInfo);
      setLoginStatus(true);
      toastSuccess("Login success");
      navigate("/home");

      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { toastError, toastSuccess } = useToast();
  const { setLoginStatus, setLoggedUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.userInfo);
      setLoggedUser(data.userInfo);
      setLoginStatus(true);
      toastSuccess("Login success");
      navigate("/home");
      return data;
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}

export function useLoginStatusQuery() {
  const { setLoginStatus, setLoggedUser } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "user"],
    queryFn: async () => {
      try {
        const data = await getLoginStatus();

        setLoggedUser(data.userInfo);
        setLoginStatus(data.success);

        return data;
      } catch (error) {
        console.error(getErrorMessage(error));

        return false;
      }
    },
  });
}

export function useLogoutMutation() {
  const { setLoggedUser, setLoginStatus } = useAuthStore();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
      setLoggedUser(null);
      setLoginStatus(false);
      navigate("/");
    },
  });
}
