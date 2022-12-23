import { env } from "env/client.mjs";
import { Workspace } from "layouts/Workspace";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ACTION_BUTTON, CARD, NOTIFICATION } from "styles";
import { trpc } from "utils/trpc";

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

  const { data: notes } = trpc.note.getNotesForUser.useQuery();

  if (status === "loading") return "Loading or not authenticated...";
  return (
    <Workspace>
      <div>
        <h1 className={NOTIFICATION}>
          Here are your notes sorted by topics and dates created.
        </h1>
        <Link href="/new/note" className={`${ACTION_BUTTON} w-full`}>
          Add Note
        </Link>
        {notes && notes.length > 0 ? (
          <>
            {notes.map((note) => (
              <div className={`${CARD} my-4`}>
                <a
                  className="text-xl"
                  href={`${env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/notes/${userId}/${note.id}`}
                >
                  {note.filename}
                </a>
                <p className="text-gray-500">{`${note.createdAt.toLocaleDateString()}, ${note.createdAt.toLocaleTimeString()}`}</p>
              </div>
            ))}
          </>
        ) : (
          <p className={NOTIFICATION}>You don't have notes currently</p>
        )}
      </div>
    </Workspace>
  );
};

export default Notes;
