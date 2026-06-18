import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiError } from "../api/client";
import { restaurantName } from "../data/constants";
import { useAuth } from "../hooks/useAuth";
import { loginFormSchema, type LoginFormValues } from "../utils/schemas";

export const AdminLoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "admin@restaurant.com",
      password: "Admin123!",
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const submit = async (values: LoginFormValues) => {
    try {
      await login(values.email, values.password);
      toast.success("Welcome back.");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(getApiError(error));
    }
  };

  return (
    <main className="grid min-h-screen bg-neutral-100 px-4 py-10">
      <div className="m-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-serif text-4xl text-neutral-950">{restaurantName}</p>
          <p className="mt-2 text-sm text-neutral-500">Admin dashboard login</p>
        </div>

        <form onSubmit={handleSubmit(submit)} className="card p-6 sm:p-8">
          <div>
            <label className="label">Email</label>
            <input className="field" type="email" {...register("email")} />
            {errors.email ? <p className="error-text">{errors.email.message}</p> : null}
          </div>
          <div className="mt-5">
            <label className="label">Password</label>
            <input className="field" type="password" {...register("password")} />
            {errors.password ? <p className="error-text">{errors.password.message}</p> : null}
          </div>

          <button className="btn-primary mt-6 w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="mt-5 rounded-2xl bg-neutral-50 p-4 text-xs leading-5 text-neutral-500">
            Seeded credentials: admin@restaurant.com / Admin123!
          </p>
        </form>
      </div>
    </main>
  );
};
