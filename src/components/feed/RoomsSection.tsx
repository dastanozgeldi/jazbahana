import { useState } from "react";
import { type Session } from "next-auth";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import { RoomItem } from "components/rooms/RoomItem";
import { NewRoom } from "./NewRoom";

type RoomSectionProps = { session: Session | null };

const RoomsSection = ({ session }: RoomSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { query } = useRouter();
  const topicId = query.topicId as string;

  const roomsQuery = topicId
    ? trpc.room.infiniteByTopicId.useInfiniteQuery(
        { limit: 5, topicId },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      )
    : trpc.room.infinite.useInfiniteQuery(
        { limit: 5 },
        {
          getPreviousPageParam: (lastPage) => lastPage.nextCursor,
        }
      );

  const { data: count } = trpc.room.getCount.useQuery();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">{count} available</span>
        </div>

        {session && (
          <>
            <button
              className={`${ACTION_BUTTON} flex items-center gap-2`}
              onClick={() => setIsOpen(true)}
            >
              <IoAdd className="w-6 h-6" /> Add Room
            </button>
            <NewRoom isOpen={isOpen} setIsOpen={setIsOpen} />
          </>
        )}
      </div>
      {/* Displaying Rooms */}
      {roomsQuery.data?.pages.map((page, _) =>
        page.items.length > 0 ? (
          page.items.map((item) => <RoomItem key={item.id} room={item} />)
        ) : (
          <p className={NOTIFICATION}>No rooms found for this.</p>
        )
      )}
      {/* Pagination */}
      <button
        className={ACTION_BUTTON}
        onClick={() => roomsQuery.fetchPreviousPage()}
        disabled={
          !roomsQuery.hasPreviousPage || roomsQuery.isFetchingPreviousPage
        }
      >
        {roomsQuery.isFetchingPreviousPage
          ? "Loading more..."
          : roomsQuery.hasPreviousPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};

export default RoomsSection;
