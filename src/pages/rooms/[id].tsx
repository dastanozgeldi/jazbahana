import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import EditRoom from "components/rooms/EditRoom";
import Messages from "components/rooms/Messages";
import { Participants } from "components/Participants";
import { CARD } from "styles";

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
    <Page title={room.title}>
      {/* Header */}
      <div className="lg:grid lg:grid-cols-3 items-start">
        <Participants roomId={id} />
        <div>
          <h1 className="text-4xl font-extrabold">{room.title}</h1>
          <p className="my-2">{room.description}</p>
          <div className="flex items-center justify-between my-2">
            <p className="text-gray-400">
              Created {room.createdAt.toLocaleDateString("en-us")}
            </p>
          </div>
          <EditRoom
            data={room}
            topics={topics}
            session={session}
            router={router}
          />
          <Messages roomId={id} session={session} />
        </div>
        <div className={`${CARD} my-2 lg:mx-4`}>
          <h1 className="my-2 text-2xl font-semibold text-center">
            Notes Sent [0]
          </h1>
        </div>
      </div>
    </Page>
  );
}
