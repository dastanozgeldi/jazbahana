import { useSession } from "next-auth/react";
import Link from "next/link";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { HometaskItem } from "./HometaskItem";

export const HometaskSection = () => {
  const { data: session } = useSession();
  const hometasksQuery = trpc.hometask.infinite.useInfiniteQuery(
    { limit: 5, userId: session?.user?.id || "" },
    {
      getPreviousPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div className="lg:mx-4">
      <h1 className={NOTIFICATION}>
        Hometasks page. Here are your most recent things to do.
      </h1>
      <Link href="/new/hometask" className={`${ACTION_BUTTON} w-full`}>
        Add Hometask
      </Link>
      {hometasksQuery.data?.pages.map((page, index) =>
        page.items.length > 0 ? (
          <div key={page.items[0].id || index}>
            {page.items.map((item) => (
              <HometaskItem item={item} />
            ))}
          </div>
        ) : (
          <p className={NOTIFICATION}>No hometasks yet.</p>
        )
      )}
      {/* Pagination */}
      <button
        className={ACTION_BUTTON}
        onClick={() => hometasksQuery.fetchPreviousPage()}
        disabled={
          !hometasksQuery.hasPreviousPage ||
          hometasksQuery.isFetchingPreviousPage
        }
      >
        {hometasksQuery.isFetchingPreviousPage
          ? "Loading more..."
          : hometasksQuery.hasPreviousPage
          ? "Load More"
          : "Nothing more to load"}
      </button>
    </div>
  );
};
