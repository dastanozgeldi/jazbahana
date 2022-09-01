import { useSession } from "next-auth/react";
import RoomsSection from "../../components/RoomsSection";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import SignIn from "../../components/SignIn";
import RecentActivity from "../../components/RecentActivity";
import Topics from "../../components/Topics";
import Avatar from "../../components/Avatar";

const Profile = () => {
  const { data: session } = useSession();
  const roomsQuery = trpc.useQuery([
    "user.rooms",
    { id: session?.user?.id as string },
  ]);
  const { data } = trpc.useQuery([
    "user.info",
    { id: session?.user?.id || "" },
  ]);

  if (!session) return <SignIn />;
  return (
    <Page title="Profile">
      {/* Header */}
      <div className="flex flex-col items-center justify-center">
        <Avatar src={data?.image} size={100} />
        <h1 className="text-4xl font-extrabold">{data?.name}</h1>
        <div className="flex items-center gap-6 my-2">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-medium">Balance:</h2>
            <p className="text-lg">{data?.balance}</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-medium">Rooms:</h2>
            <p className="text-lg">{roomsQuery.data?.length}</p>
          </div>
        </div>
        {data?.bio && (
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-medium">Bio:</h2>
            <p className="text-lg">{data.bio}</p>
          </div>
        )}
      </div>
      {/* User Posts */}
      <div className="my-8 block md:grid md:grid-cols-3 md:justify-items-center">
        {/* TODO: mates list w/ clickable profiles instead of topics */}
        <Topics />
        <RoomsSection profilePage roomsQuery={roomsQuery} session={session} />
        <RecentActivity />
      </div>
    </Page>
  );
};

export default Profile;
