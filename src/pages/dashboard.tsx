import { useSession } from "next-auth/react";
import { HometaskSection } from "components/hometasks/HometaskSection";
import { UserInfo } from "components/profile/UserInfo";
import { PinnedRooms } from "components/profile/PinnedRooms";
import { Page } from "layouts/Page";
import { trpc } from "utils/trpc";

const Dashboard = () => {
  const { data: session } = useSession();
  const id = session?.user?.id as string;
  const { data: user } = trpc.user.info.useQuery({ id });

  return (
    <Page
      title="Profile"
      className="xl:grid xl:grid-cols-3 xl:justify-items-center"
    >
      <div className="w-full xl:px-4">
        <UserInfo user={user} session={session} />
      </div>
      <PinnedRooms />
      <div className="w-full xl:px-4">
        <HometaskSection />
      </div>
    </Page>
  );
};

export default Dashboard;
