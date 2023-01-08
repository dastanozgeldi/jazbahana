import { type Note } from "@prisma/client";
import { UploadNote } from "components/common/UploadNote";
import { env } from "env/client.mjs";
import { Workspace } from "layouts/Workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ACTION_BUTTON, CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

type NoteItemProps = {
  userId: string;
  note: Note;
};

const NoteItem = ({ userId, note }: NoteItemProps) => (
  <div className={`${CARD} my-4 space-y-4`}>
    <a
      className="text-xl text-center"
      href={`${env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/notes/${userId}/${note.id}`}
    >
      {note.filename}
    </a>
    <p className="text-gray-500">{`${note.createdAt.toLocaleDateString()}, ${note.createdAt.toLocaleTimeString()}`}</p>
  </div>
);

const Notes = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  const notesQuery = trpc.note.infinite.useInfiniteQuery(
    { limit: 5 },
    {
      getPreviousPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Here are your notes sorted by topics and dates created.
        </h1>
        <div className="flex items-center gap-2">
          <Link href="/new/note" className={`${ACTION_BUTTON} w-full`}>
            Take Note
          </Link>
          <UploadNote className="w-full" />
        </div>

        {notesQuery.data?.pages.map((page, _) =>
          page.items.length > 0 ? (
            page.items.map((note) => <NoteItem userId={userId} note={note} />)
          ) : (
            <p className={NOTIFICATION}>No hometasks yet.</p>
          )
        )}
        {/* Pagination */}
        <button
          className={ACTION_BUTTON}
          onClick={() => notesQuery.fetchPreviousPage()}
          disabled={
            !notesQuery.hasPreviousPage || notesQuery.isFetchingPreviousPage
          }
        >
          {notesQuery.isFetchingPreviousPage
            ? "Loading more..."
            : notesQuery.hasPreviousPage
            ? "Load More"
            : "Nothing more to load"}
        </button>
      </div>
    </Workspace>
  );
};

export default Notes;
