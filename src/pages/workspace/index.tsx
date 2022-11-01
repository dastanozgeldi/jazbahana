import Workspace from "components/layouts/Workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ACTION_BUTTON, NOTIFICATION } from "styles";

const Notes = () => {
  const { push } = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/api/auth/signin");
    },
  });

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Here are your notes sorted by topics and dates created.
        </h1>
        <Link href="/new/note">
          <button className={`${ACTION_BUTTON} w-full`}>Add Note</button>
        </Link>
      </div>
    </Workspace>
  );
};

export default Notes;
