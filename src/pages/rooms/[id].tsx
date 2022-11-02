import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import EditRoom from "components/rooms/EditRoom";
import Messages from "components/rooms/Messages";
import { CARD } from "styles";
import { useRef, useState } from "react";
import type { Room, Topic } from "@prisma/client";
import Link from "next/link";
import Avatar from "components/Avatar";

type RoomInfoProps = {
  room: Room & any;
  topics: Topic[] & any;
  router: any;
};

const Participants = ({ roomId }: { roomId: string }) => {
  const { data: participants } = trpc.useQuery(["participant.all", { roomId }]);

  return (
    <div className={`${CARD} lg:mx-4`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Participants - {participants?.length}
      </h1>
      <div className="w-full flex flex-nowrap gap-1 overflow-x-scroll">
        {participants &&
          participants.map((item) => (
            <Link href={`/users/${item.userId}`}>
              <a>
                <Avatar src={item.user.image} size={32} />
              </a>
            </Link>
          ))}
      </div>
    </div>
  );
};

const RoomInfo = ({ room, topics, router }: RoomInfoProps) => {
  const { data: session } = useSession();

  return (
    <div className="my-4 lg:my-0">
      <h1 className="text-4xl font-extrabold">{room.title}</h1>
      <p className="my-2">{room.description}</p>
      <div className="flex items-center justify-between my-2">
        <p className="text-gray-400">
          Created {room.createdAt.toLocaleDateString("en-us")}
        </p>
      </div>
      <EditRoom data={room} topics={topics} session={session} router={router} />
      <Messages roomId={room.id} session={session} />
    </div>
  );
};

type SentNotesProps = { roomId: string };

const SentNotes = ({ roomId }: SentNotesProps) => {
  const [file, setFile] = useState<File>();
  const fileRef = useRef<HTMLInputElement>(null);

  const notesQuery = trpc.useQuery(["note.getNotesForRoom", { roomId }]);
  console.log(notesQuery.data);

  const { mutateAsync: createPresignedUrl } = trpc.useMutation(
    "note.createPresignedUrl"
  );

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.currentTarget.files?.[0]);
  };

  const uploadNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl({ filename: file.name })) as any;
    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }
    await fetch(url, {
      method: "POST",
      body: formData,
    });
    setFile(undefined);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
    notesQuery.refetch();
  };

  return (
    <div className={`${CARD} my-2 lg:mx-4`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Notes Sent - {notesQuery.data?.length}
      </h1>
      {/* Display uploaded files specific to the chat */}
      {file && <a className={`${CARD} m-2`}>{file.name}</a>}
      <form
        className="text-white border-t-[1px] p-2 border-t-gray-700"
        onSubmit={uploadNote}
      >
        <input
          ref={fileRef}
          id="file-upload"
          className="ml-4 text-white"
          onChange={onFileChange}
          type="file"
        />
        {file && (
          <button className="ml-4" type="submit">
            Upload
          </button>
        )}
      </form>
    </div>
  );
};

export default function RoomViewPage() {
  // Router
  const router = useRouter();
  const id = router.query.id as string;
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

  if (!room || roomQuery.status !== "success") return "Loading...";
  return (
    <Page title={room.title}>
      <div className="lg:grid lg:grid-cols-3 items-start gap-2">
        <Participants roomId={id} />
        <RoomInfo room={room} topics={topics} router={router} />
        <SentNotes roomId={id} />
      </div>
    </Page>
  );
}
