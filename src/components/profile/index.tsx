import type { User } from "@prisma/client";
import { HometaskSection } from "components/Hometasks";
import Page from "components/layouts/Page";
import { useSession } from "next-auth/react";
import { Info } from "./Info";
import { PinnedRooms } from "./PinnedRooms";

export const UserProfile = ({ user }: { user: User & any }) => {
  const { data: session } = useSession();

  return user?.id && user.id === session?.user?.id ? (
    <Page
      title="Profile"
      className="xl:grid xl:grid-cols-3 xl:justify-items-center"
    >
      <Info user={user} session={session} />
      <PinnedRooms id={user?.id} schoolId={user?.schoolId || ""} />
      <HometaskSection />
    </Page>
  ) : (
    <Page title="Profile" className="max-w-[48ch] w-full mx-auto">
      <Info user={user} session={session} />
    </Page>
  );
};
