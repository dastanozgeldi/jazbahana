import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import RecentActivity from "../../components/RecentActivity";
import Avatar from "../../components/Avatar";
import PeopleFromSchool from "components/PeopleFromSchool";
import EditProfile from "components/EditProfile";
import { HIGHLIGHT } from "styles";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: session } = useSession();
  // tRPC
  const { data: user } = trpc.useQuery(["user.info", { id }]);
  const { data: schools } = trpc.useQuery(["school.all"]);

  return (
    <Page title="Profile">
      <div className="block md:grid md:grid-cols-3 md:justify-items-center">
        {/* People from your school */}
        <PeopleFromSchool id={user?.id || ""} schoolId={user?.schoolId || ""} />
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <Avatar src={user?.image} size={100} />
          <h1 className="text-4xl font-extrabold">{user?.name}</h1>
          <div className="flex items-center gap-6 my-2">
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <span className={HIGHLIGHT}>Balance:</span>
              </h2>
              <p className="text-lg">{user?.balance}</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <span className={HIGHLIGHT}>Rooms:</span>
              </h2>
              <p className="text-lg">{user?.Room.length}</p>
            </div>
          </div>
          {user?.school && (
            <div className="flex items-center gap-6 my-2">
              <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl font-medium">
                  <span className={HIGHLIGHT}>School:</span>
                </h2>
                <p className="text-lg">{user.school.name}</p>
              </div>
              {user.grade && (
                <div className="flex flex-col justify-center items-center">
                  <h2 className="text-xl font-medium">
                    <span className={HIGHLIGHT}>Grade:</span>
                  </h2>
                  <p className="text-lg">{user.grade}</p>
                </div>
              )}
            </div>
          )}
          {user?.bio && (
            <div className="my-4 flex flex-col justify-center items-center">
              <h2 className="text-xl font-medium">
                <span className={HIGHLIGHT}>Bio:</span>
              </h2>
              <p className="text-lg">
                <ReactMarkdown>{user.bio}</ReactMarkdown>
              </p>
            </div>
          )}
          {query.id === session?.user?.id && (
            <EditProfile data={user} schools={schools} session={session} />
          )}
        </div>
        <RecentActivity />
      </div>
    </Page>
  );
}
