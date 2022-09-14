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
import { ACTION_BUTTON, CARD, LABEL, TEXTAREA } from "../../styles";
import PeopleFromSchool from "components/PeopleFromSchool";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: session } = useSession();
  // tRPC
  const { data: user } = trpc.useQuery(["user.info", { id }]);

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
        </div>
        <RecentActivity />
      </div>
    </Page>
  );
}

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
