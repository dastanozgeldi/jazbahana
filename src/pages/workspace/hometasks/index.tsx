import { HometaskSection } from "components/Hometasks";
import Workspace from "components/layouts/Workspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Hometasks = () => {
  const { push } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/api/auth/signin");
    },
  });

  if (status === "loading") {
    return "Loading or not authenticated...";
  }
  return (
    <Workspace>
      <HometaskSection />
    </Workspace>
  );
};

export default Hometasks;
