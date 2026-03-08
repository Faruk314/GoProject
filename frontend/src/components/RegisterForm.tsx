import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../schemas/auth";
import type { RegisterInput } from "../types/auth";
import { useRegisterMutation } from "../api/queries/auth";
import Input from "../components/ui/Input";
import Button from "./ui/Button";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: registerUser, isPending } = useRegisterMutation();

  function onSubmit(data: RegisterInput) {
    registerUser(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Full Name"
        id="name"
        type="text"
        placeholder="John Doe"
        error={errors.username?.message}
        {...register("username")}
      />

      <Input
        label="Email address"
        id="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      <Input
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button
        type="submit"
        isLoading={isPending}
        loadingText="Creating account..."
      >
        Create Account
      </Button>
    </form>
  );
}

export default RegisterForm;
