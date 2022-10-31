import Workspace from "components/layouts/Workspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NOTIFICATION } from "styles";

const Notes = () => {
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
      <h1 className={NOTIFICATION}>
        Here are your notes sorted by topics and dates created.
      </h1>
    </Workspace>
  );
};

export default Notes;
