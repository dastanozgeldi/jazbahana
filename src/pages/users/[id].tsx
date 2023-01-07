import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { Page } from "layouts/Page";
import { UserInfo } from "components/profile/UserInfo";
import { useSession } from "next-auth/react";

const Profile = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: user } = trpc.user.info.useQuery({ id });
  const { data: session } = useSession();

  if (!user) return <>User was not found.</>;
  if (user?.id === session?.user?.id) router.push("/dashboard");
  return (
    <Page title="Profile" className="max-w-[48ch] w-full mx-auto">
      <UserInfo user={user} session={session} />
    </Page>
  );
};

export default Profile;
