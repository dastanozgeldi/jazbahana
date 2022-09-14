import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import RecentActivity from "../../components/RecentActivity";
import Avatar from "../../components/Avatar";
import H from "../../components/Highlight";
import { ACTION_BUTTON, CARD, LABEL, TEXTAREA, TOPIC } from "../../styles";
import Link from "next/link";
import { IoPeople } from "react-icons/io5";
import PeopleFromSchool from "components/PeopleFromSchool";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: session } = useSession();
  // tRPC
  const { data, status } = trpc.useQuery(["user.recentRoom", { id }]);
  const { data: user } = trpc.useQuery(["user.info", { id }]);

  if (!data || status !== "success") {
    return <>Loading...</>;
  }
  return (
    <Page title="Profile">
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        {/* TODO: mates list w/ clickable profiles instead of topics */}
        {/* People from your school */}
        <PeopleFromSchool id={user?.id || ""} schoolId={user?.schoolId || ""} />
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <Avatar src={user?.image} size={100} />
          <h1 className="text-4xl font-extrabold">{user?.name}</h1>
          <div className="flex items-center gap-6 my-2">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <H>Balance:</H>
              </h2>
              <p className="text-lg">{user?.balance}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <H>Rooms:</H>
              </h2>
              <p className="text-lg">{user?.Room.length}</p>
            </div>
          </div>
          {user?.school && (
            <div className="flex items-center gap-6 my-2">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-medium">
                  <H>School:</H>
                </h2>
                <p className="text-lg">{user.school.name}</p>
              </div>
              {user.grade && (
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-xl font-medium">
                    <H>Grade:</H>
                  </h2>
                  <p className="text-lg">{user.grade}</p>
                </div>
              )}
            </div>
          )}
          {user?.bio && (
            <div className="my-4 flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <H>Bio:</H>
              </h2>
              <p className="text-lg">
                <ReactMarkdown>{user.bio}</ReactMarkdown>
              </p>
            </div>
          )}
          {query.id === session?.user?.id && (
            <EditProfile data={user} session={session} />
          )}
          <RecentRoom data={data} />
        </div>
        <RecentActivity />
      </div>
    </Page>
  );
}

const RecentRoom = ({ data }: { data: any }) => {
  return (
    <>
      <h2 className="text-xl font-medium mt-4">
        <H>Last Room:</H>
      </h2>
      <article
        className="w-full my-2 flex gap-2 flex-col text-[#202020] bg-neutral-100 dark:text-neutral-100 dark:bg-[#202020] p-4 rounded-xl"
        key={data.id}
      >
        <div className="flex items-center justify-between">
          <Link href={`/users/${data.authorId || "ghost"}`}>
            <a className="flex items-center gap-2 font-medium">
              <Avatar src={data.authorImage} size={32} />
              <span>{data.authorName || "ghost"}</span>
            </a>
          </Link>
          <p className="text-gray-500">{`${data.updatedAt.toLocaleDateString()}, ${data.updatedAt.toLocaleTimeString()}`}</p>
        </div>
        <Link href={`/rooms/${data.id}`}>
          <a className="max-w-max text-2xl font-semibold">{data.title}</a>
        </Link>
        <p className="text-gray-400">{data.description}</p>
        <div className="my-2 flex justify-between">
          <span className={`${TOPIC} flex items-center gap-2`}>
            <IoPeople className="w-5 h-5" /> 0 participants
          </span>
          {data.topic && (
            <span
              className={`${TOPIC} flex items-center gap-2`}
              key={data.topicId}
            >
              {data.topic.image && (
                <img src={data.topic.image} className="w-4 h-4" />
              )}
              {data.topic.name}
            </span>
          )}
        </div>
      </article>
    </>
  );
};

type EditProfileProps = {
  data?: User | null;
  session: Session | null;
};

type FormData = {
  bio: string;
};

const EditProfile = ({ data, session }: EditProfileProps) => {
  // States
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(data?.bio);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const editProfile = trpc.useMutation("user.edit", {
    async onSuccess() {
      await utils.invalidateQueries([
        "user.info",
        { id: session?.user?.id || "" },
      ]);
    },
  });

  const onSubmit = handleSubmit(async () => {
    try {
      await editProfile.mutateAsync({
        id: session?.user?.id || "",
        data: {
          bio: bio || "",
        },
      });
    } catch {}
  });
  return (
    <>
      <button className={ACTION_BUTTON} onClick={() => setEditing(!editing)}>
        Edit Profile
      </button>
      <div className="max-w-[60ch] w-full" hidden={!editing}>
        <div className={`my-10 flex items-center justify-center ${CARD}`}>
          <form className="w-[90%]" onSubmit={onSubmit}>
            <h2 className="text-center text-3xl font-bold mb-2">
              Edit Profile
            </h2>
            <div className="my-4">
              <label className={LABEL} htmlFor="bio">
                Bio:
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                className={TEXTAREA}
                value={bio || ""}
                onChange={(e) => setBio(e.currentTarget.value)}
                disabled={editProfile.isLoading}
              />
            </div>

            <button
              className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
              type="submit"
              disabled={editProfile.isLoading}
            >
              Save
            </button>

            {editProfile.error && (
              <p className="text-red-500">{editProfile.error.message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
