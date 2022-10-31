import type { User } from "@prisma/client";
import Workspace from "components/layouts/Workspace";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const ConnectionItem = ({ connection }: { connection: User }) => {
  return (
    <div>
      <h1>
        {connection.name} - {connection.id}
      </h1>
    </div>
  );
};

const Connections = () => {
  const { push } = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      push("/api/auth/signin");
    },
  });

  const id = session?.user?.id as string;
  const { data: user } = trpc.useQuery(["user.info", { id }]);
  const { data: connections } = trpc.useQuery([
    "user.connections",
    {
      id,
      schoolId: user?.schoolId || "",
    },
  ]);

  if (status === "loading") {
    return "Loading or not authenticated...";
  }
  return (
    <Workspace>
      <h1 className={NOTIFICATION}>Here are people you are connected with.</h1>
      {connections?.map((conn) => (
        <ConnectionItem connection={conn} />
      ))}
    </Workspace>
  );
};

export default Connections;
