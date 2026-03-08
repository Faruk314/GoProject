import { useLogoutMutation } from "../api/queries/auth";
import Button from "../components/ui/Button";
import { useAuthStore } from "../store/auth";

function Home() {
  const { mutate: logoutUser, isPending } = useLogoutMutation();
  const { loggedUser } = useAuthStore();

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center py-4">
        <div className="text-3xl">Hello {loggedUser?.username}</div>

        <Button
          type="submit"
          className="w-max"
          isLoading={isPending}
          loadingText="Logging you out..."
          onClick={() => logoutUser()}
        >
          Logout
        </Button>
      </div>
    </section>
  );
}

export default Home;
