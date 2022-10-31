import { useSession } from "next-auth/react";
import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import EditRoom from "components/rooms/EditRoom";
import Messages from "components/rooms/Messages";
import { ACTION_BUTTON, CARD } from "styles";
import { useState } from "react";
import axios from "axios";
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
    <div>
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

const BUCKET_URL = "https://jazbahana-image-upload-test.s3.amazonaws.com/";

const SentNotes = () => {
  const [file, setFile] = useState<any>();
  const [uploadingStatus, setUploadingStatus] = useState<any>();
  const [uploadedFile, setUploadedFile] = useState<any>();

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

    setUploadedFile(BUCKET_URL + file.name);
    setFile(null);
  };

  const uploadedFilename = uploadedFile && uploadedFile.split(BUCKET_URL)[1];

  return (
    <div className={`${CARD} my-2 lg:mx-4`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Notes Sent - 0
      </h1>
      {/* Display uploaded files specific to the chat */}
      <a className={`${CARD} m-2`} href={uploadedFile}>
        {uploadedFilename}
      </a>
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
      <div className="lg:grid lg:grid-cols-3 items-start">
        <Participants roomId={id} />
        <RoomInfo room={room} topics={topics} router={router} />
        <SentNotes />
      </div>
    </Page>
  );
}
