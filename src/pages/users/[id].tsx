import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import RecentActivity from "../../components/RecentActivity";
import Avatar from "../../components/Avatar";
import PeopleFromSchool from "components/PeopleFromSchool";
import { ACTION_BUTTON, HIGHLIGHT, NOTIFICATION } from "styles";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: user } = trpc.useQuery(["user.info", { id }]);
  const { data: session } = useSession();

  return (
    <Page title="Profile">
      <div className="block md:grid md:grid-cols-3 md:justify-items-center">
        {/* People from your school */}
        <PeopleFromSchool id={user?.id || ""} schoolId={user?.schoolId || ""} />
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          <h1 className={`${NOTIFICATION} mt-0 text-center`}>
            This is your profile. Make it look like nobody else&apos;s!
          </h1>
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
          {session?.user?.id === user?.id && (
            <Link href="/edit-profile">
              <a className={ACTION_BUTTON}>Edit Profile</a>
            </Link>
          )}
        </div>
        <RecentActivity />
      </div>
    </Page>
  );
}
