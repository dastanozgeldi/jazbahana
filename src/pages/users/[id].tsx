import { useSession } from "next-auth/react";
import RoomsSection from "../../components/RoomsSection";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import SignIn from "../../components/SignIn";

const Profile = () => {
  const { data: session } = useSession();
  const roomsQuery = trpc.useQuery([
    "user.rooms",
    { id: session?.user?.id as string },
  ]);

  if (!session) return <SignIn />;
  return (
    <Page title="Profile">
      {/* Header */}
      <div className="flex flex-col items-center justify-center">
        <img
          className="rounded-full"
          src={session.user?.image || "/default-avatar.png"}
          width={100}
          height={100}
          alt="User Avatar"
        />
        <h1 className="text-4xl font-extrabold">{session.user?.name}</h1>
      </div>
      {/* User Posts */}
      <div className="max-w-[60ch] mx-auto">
        <RoomsSection profilePage roomsQuery={roomsQuery} session={session} />
      </div>
    </Page>
  );
};

export default Profile;
