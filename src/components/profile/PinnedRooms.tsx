import { RoomItem } from "components/rooms/RoomItem";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

export const PinnedRooms = () => {
  const { data: pinnedRooms } = trpc.user.pinnedRooms.useQuery();

  return (
    <div className="my-4">
      {/* Notification */}
      <h1 className={`${NOTIFICATION} mt-0 text-center`}>
        This is the profile page. Here you can see some general information
        about a user.
      </h1>
      <h1 className="text-2xl font-semibold text-center">Pinned Rooms</h1>
      <ul>
        {pinnedRooms && pinnedRooms?.length > 0 ? (
          pinnedRooms.map((item) => (
            <RoomItem key={item.room.id} room={item.room} />
          ))
        ) : (
          <p className={NOTIFICATION}>No pinned rooms.</p>
        )}
      </ul>
    </div>
  );
};
