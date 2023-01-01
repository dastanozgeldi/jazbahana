import { useRouter } from "next/router";
import { UserProfile } from "components/profile";
import { trpc } from "utils/trpc";

const Profile = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: user } = trpc.user.info.useQuery({ id });

  if (!user) return <>User was not found.</>;
  return <UserProfile user={user} />;
};

export default Profile;
