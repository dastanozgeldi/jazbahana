import { type User } from "@prisma/client";
import { Page } from "layouts/Page";
import { useSession } from "next-auth/react";
import { Info } from "./Info";

export const UserProfile = ({ user }: { user: User & any }) => {
  const { data: session } = useSession();

  return (
    <Page title="Profile" className="max-w-[48ch] w-full mx-auto">
      <Info user={user} session={session} />
    </Page>
  );
};
