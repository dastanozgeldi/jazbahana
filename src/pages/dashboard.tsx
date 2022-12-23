import { HometaskSection } from "components/hometasks/HometaskSection";
import { Info } from "components/profile/Info";
import { PinnedRooms } from "components/profile/PinnedRooms";
import { Page } from "layouts/Page";
import { useSession } from "next-auth/react";
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
      <div className="w-full px-4">
        <Info user={user} session={session} />
      </div>
      <PinnedRooms id={id} schoolId={user?.schoolId || ""} />
      <HometaskSection />
    </Page>
  );
};

export default Dashboard;
