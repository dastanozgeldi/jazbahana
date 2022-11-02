import { Fragment } from "react";
import type { Session } from "next-auth";
import Link from "next/link";
import { ACTION_BUTTON, NOTIFICATION } from "../../styles";
import { trpc } from "../../utils/trpc";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import { RoomItem } from "../rooms/RoomItem";

type RoomSectionProps = { session: Session | null };

export default function RoomsSection({ session }: RoomSectionProps) {
  const { query } = useRouter();
  const topicId = query.topicId as string;

  const roomsQuery = topicId
    ? trpc.useInfiniteQuery(["room.infiniteByTopicId", { limit: 5, topicId }], {
        getPreviousPageParam: (lastPage) => lastPage.nextCursor,
      })
    : trpc.useInfiniteQuery(["room.infinite", { limit: 5 }], {
        getPreviousPageParam: (lastPage) => lastPage.nextCursor,
      });

  const { data: count } = trpc.useQuery(["room.getCount"]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">{count} available</span>
        </div>

        {session && (
          <Link href="/new/room">
            <a className={`${ACTION_BUTTON} flex items-center gap-2`}>
              <IoAdd className="w-6 h-6" /> Add Room
            </a>
          </Link>
        )}
      </div>
      {/* Displaying Rooms */}
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
}