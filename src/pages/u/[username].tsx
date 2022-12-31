import { useRouter } from "next/router";
import { UserProfile } from "components/profile";
import { trpc } from "utils/trpc";

const ProfileByUsername = () => {
  const { query } = useRouter();
  const username = query.username as string;
  const { data: user } = trpc.user.info.useQuery({ username });

  if (!user) return <>User was not found.</>
  return <UserProfile user={user} />;
};

export default ProfileByUsername;
