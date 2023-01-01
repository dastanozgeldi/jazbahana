import { type User } from "@prisma/client";
import { Page } from "layouts/Page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Info } from "./Info";

export const UserProfile = ({ user }: { user: User }) => {
  const router = useRouter();
  const { data: session } = useSession();

  if (user?.id === session?.user?.id) router.push("/dashboard");
  return (
    <Page title="Profile" className="max-w-[48ch] w-full mx-auto">
      <Info user={user} session={session} />
    </Page>
  );
};
