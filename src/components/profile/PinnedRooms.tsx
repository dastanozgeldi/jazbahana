import { RoomItem } from "components/rooms/RoomItem";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PinnedRoomsProps = { id: string; schoolId: string };

export const PinnedRooms = ({ id, schoolId }: PinnedRoomsProps) => {
  const roomsQuery = trpc.room.pinnedRooms.useQuery({ authorId: id });

  return (
    <div className="my-4">
      {/* Notification */}
      <h1 className={`${NOTIFICATION} mt-0 text-center`}>
        This is the profile page. Here you can see some general information
        about a user.
      </h1>
      <h1 className="text-2xl font-semibold text-center">Pinned Rooms</h1>
      <ul>
        {roomsQuery.data ? (
          <>
            {roomsQuery.data.map((item: any) => (
              <RoomItem key={item.id} data={item} />
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>No rooms found for this.</p>
        )}
      </ul>
    </div>
  );
};
