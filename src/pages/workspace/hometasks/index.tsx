import { HometaskSection } from "components/hometasks/HometaskSection";
import { Workspace } from "layouts/Workspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Hometasks = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <HometaskSection />
    </Workspace>
  );
};

export default Hometasks;
