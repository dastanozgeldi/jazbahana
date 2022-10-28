import { useRouter } from "next/router";
import { UserProfile } from "components/profile";
import { trpc } from "utils/trpc";

export default function ProfileByUsername() {
  const { query } = useRouter();
  const username = query.username as string;
  const { data: user } = trpc.useQuery(["user.info", { username }]);
  return <UserProfile user={user} />;
}
