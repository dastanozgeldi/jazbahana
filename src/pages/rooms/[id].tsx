import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import EditRoom from "components/EditRoom";
import Messages from "components/Messages";
import { Participants } from "components/Participants";

export default function RoomViewPage() {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // Session
  const { data: session } = useSession();
  // tRPC
  const roomQuery = trpc.useQuery(["room.byId", { id }]);
  const { data: room } = roomQuery;
  const { data: topics } = trpc.useQuery(["topic.all"]);

  // room fetch fail
  if (roomQuery.error) {
    return (
      <NextError
        title={roomQuery.error.message}
        statusCode={roomQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (!room || roomQuery.status !== "success") return <>Loading...</>;
  return (
    <Page title={room.title} className="max-w-[60ch] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold">{room.title}</h1>
        <p className="my-2">{room.description}</p>
        <div className="flex items-center justify-between my-2">
          <p className="text-gray-400">
            Created {room.createdAt.toLocaleDateString("en-us")}
          </p>
        </div>
        <Participants roomId={id} />
        <EditRoom
          data={room}
          topics={topics}
          session={session}
          router={router}
        />
        <Messages roomId={id} session={session} />
      </div>
      {/* TODO: find something to put on the right side */}
      {/* I'm thinking of a separate notes chat */}
      {/* where we upload files to storage, I hope */}
    </Page>
  );
}
