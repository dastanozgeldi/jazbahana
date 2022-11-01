import { RoomItem } from "components/rooms/RoomItem";
import { Fragment } from "react";
import { NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type PinnedRoomsProps = { id: string; schoolId: string };

export const PinnedRooms = ({ id, schoolId }: PinnedRoomsProps) => {
  const roomsQuery = trpc.useInfiniteQuery(["room.infinite", { limit: 5 }], {
    getPreviousPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div className="my-4">
      {/* Notification */}
      <h1 className={`${NOTIFICATION} mt-0 text-center`}>
        This is the profile page. Here you can see some general information
        about a user.
      </h1>
      <h1 className="text-2xl font-semibold text-center">Pinned Rooms</h1>
      <ul>
        {roomsQuery.data?.pages.map((page, index) => (
          <>
            {page.items.length > 0 ? (
              <Fragment key={page.items[0].id || index}>
                {page.items.map((item) => (
                  <RoomItem key={item.id} data={item} />
                ))}
              </Fragment>
            ) : (
              <p className={NOTIFICATION}>No rooms found for this.</p>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};
