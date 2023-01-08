import { useState } from "react";
import { ACTION_BUTTON, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";
import { HometaskItem } from "./HometaskItem";
import { NewHometask } from "./NewHometask";

export const HometaskSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const hometasksQuery = trpc.hometask.infinite.useInfiniteQuery(
    { limit: 5 },
    {
      getPreviousPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      <h1 className={NOTIFICATION}>
        Hometasks. Here are your most recent things to do.
      </h1>
      <button
        onClick={() => setIsOpen(true)}
        className={`${ACTION_BUTTON} w-full`}
      >
        Add Hometask
      </button>
      <NewHometask isOpen={isOpen} setIsOpen={setIsOpen} />
      {hometasksQuery.data?.pages.map((page, _) =>
        page.items.length > 0 ? (
          page.items.map((hometask) => <HometaskItem hometask={hometask} />)
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
