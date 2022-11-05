import type { User } from "@prisma/client";
import Avatar from "components/Avatar";
import Workspace from "components/layouts/Workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

const ConnectionItem = ({ connection }: { connection: User }) => {
  return (
    <Link href={`/users/${connection.id}`}>
      <a className="flex items-center justify-between p-4 my-4 rounded-xl border-[1px] border-gray-700 hover:border-gray-500 duration-300">
        <Avatar src={connection.image} size={50} />
        <a>{connection.name}</a>
      </a>
    </Link>
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
      <div>
        <h1 className={NOTIFICATION}>
          Here are people you are connected with.
        </h1>
        <div className="w-full">
          {connections?.map((connection) => (
            <ConnectionItem connection={connection} />
          ))}
        </div>
      </div>
    </Workspace>
  );
};

export default Connections;
