import type { Session } from "next-auth";
import Link from "next/link";
import { ACTION_BUTTON } from "../styles";
import { trpc } from "../utils/trpc";
import { IoAdd } from "react-icons/io5";
import { useRouter } from "next/router";
import Room from "./Room";

type RoomSectionProps = { session: Session | null };

export default function RoomsSection({ session }: RoomSectionProps) {
  const { query } = useRouter();
  const page = query.page ? Number(query.page) - 1 : 0;

  const topicId = query.topicId as string;

  const { data } = topicId
    ? trpc.useInfiniteQuery(
        ["room.infiniteByTopicId", { limit: 10, topicId }],
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
          getPreviousPageParam: () => page - 1,
        }
      )
    : trpc.useInfiniteQuery(["room.infinite", { limit: 5 }], {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPreviousPageParam: () => page - 1,
      });
  const rooms = data?.pages[page]?.items;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <span className="text-gray-400">{rooms?.length} available</span>
        </div>

        {session && (
          <Link href="/new">
            <a className={`${ACTION_BUTTON} flex items-center gap-2`}>
              <IoAdd className="w-6 h-6" /> Add Room
            </a>
          </Link>
        )}
      </div>
      {/* Displaying Rooms */}
      {rooms?.map((room) => (
        <Room key={room.id} data={room} />
      ))}
      {/* Pagination */}
      {rooms && rooms.length > 0 && (
        <div className="flex justify-between my-2">
          <button className={ACTION_BUTTON}>previous page</button>
          <button className={ACTION_BUTTON}>next page</button>
        </div>
      )}
    </div>
  );
}
