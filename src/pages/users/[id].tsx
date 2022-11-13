import { useRouter } from "next/router";
import { UserProfile } from "components/profile";
import { trpc } from "utils/trpc";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: user } = trpc.user.info.useQuery({ id });
  return <UserProfile user={user} />;
}
