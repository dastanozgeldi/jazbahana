import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import EditRoom from "components/rooms/EditRoom";
import { ACTION_BUTTON, CARD } from "styles";
import { useState } from "react";
import Link from "next/link";
import Avatar from "components/Avatar";
import axios from "axios";

const Participants = ({ roomId }: { roomId: string }) => {
  const { data: participants } = trpc.participant.all.useQuery({ roomId });

  return (
    <div className={`${CARD} my-2`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Participants - {participants?.length}
      </h1>
      <div className="w-full flex flex-nowrap gap-1 overflow-x-scroll">
        {participants &&
          participants.map((item) => (
            <Link href={`/users/${item.userId}`}>
              <Avatar src={item.user.image} size={32} />
            </Link>
          ))}
      </div>
    </div>
  );
};

const BUCKET_URL = "https://jazbahana-image-upload-test.s3.amazonaws.com/";

const SentNotes = ({ roomId }: { roomId: string }) => {
  const [file, setFile] = useState<any>();
  const [uploadingStatus, setUploadingStatus] = useState<any>();
  const [uploadedFile, setUploadedFile] = useState<any>();

  const addNote = trpc.note.add.useMutation();
  const notesQuery = trpc.note.getNotesForRoom.useQuery({ roomId });

  const selectFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    setUploadingStatus("Uploading the file to AWS S3");

    let { data } = await axios.post("/api/uploadFile", {
      name: file.name,
      type: file.type,
    });

    console.log(data);

    const url = data.url;
    await axios.put(url, file, {
      headers: {
        "Content-type": file.type,
        "Access-Control-Allow-Origin": "*",
      },
    });

    await addNote.mutateAsync({ roomId, filename: file.name });

    setUploadedFile(BUCKET_URL + file.name);
    setFile(null);
    notesQuery.refetch();
  };

  return (
    <div className={`${CARD} my-2`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Notes Sent - {notesQuery.data?.length}
      </h1>
      {notesQuery.data?.map((note) => (
        <a
          className={`${CARD} m-2 w-full text-left`}
          href={BUCKET_URL + note.filename}
        >
          {note.filename}
        </a>
      ))}
      <div className="border-t-[1px] w-full border-gray-700 p-4">
        <input type="file" onChange={(e) => selectFile(e)} />
        {file && (
          <button onClick={uploadFile} className={`${ACTION_BUTTON} my-2`}>
            Upload a File!
          </button>
        )}
        {uploadingStatus && <p>{uploadingStatus}</p>}
      </div>
    </div>
  );
};

export default function RoomViewPage() {
  const { data: session } = useSession();
  // Router
  const router = useRouter();
  const id = router.query.id as string;
  // tRPC
  const roomQuery = trpc.room.byId.useQuery({ id });
  const { data: room } = roomQuery;
  const { data: topics } = trpc.topic.all.useQuery();

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
      <div className="my-4 lg:my-0 max-w-[60ch] mx-auto">
        <Participants roomId={room.id} />
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
        <SentNotes roomId={room.id} />
      </div>
    </Page>
  );
}
