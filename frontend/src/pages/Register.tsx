import RegisterForm from "../components/RegisterForm";
import { Link } from "react-router-dom";

function Register() {
  return (
    <section className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <RegisterForm />

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link
            to="/"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
