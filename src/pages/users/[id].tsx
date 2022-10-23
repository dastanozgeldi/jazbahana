import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import { UpcomingDeadlines } from "../../components/profile/UpcomingDeadlines";
import { PinnedRooms } from "components/profile/PinnedRooms";
import { Info } from "components/profile/Info";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: user } = trpc.useQuery(["user.info", { id }]);
  const { data: session } = useSession();

  return (
    <Page
      title="Profile"
      className="xl:grid xl:grid-cols-3 xl:justify-items-center"
    >
      <Info user={user} session={session} />
      <PinnedRooms id={user?.id || ""} schoolId={user?.schoolId || ""} />
      <UpcomingDeadlines />
    </Page>
  );
}
