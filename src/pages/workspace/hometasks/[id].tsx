import { EditHometask } from "components/hometasks/EditHometask";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { trpc } from "utils/trpc";

const HometaskView = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const id = router.query.id as string;
  const { data: hometask, status } = trpc.hometask.byId.useQuery({ id });
  const { status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });
  const { data: topics } = trpc.topic.all.useQuery();

  if (!hometask || status !== "success" || authStatus === "loading") {
    return "Loading or not authenticated...";
  }
  return (
    <div className="max-w-[60ch] mx-auto">
      {/* Header */}
      <div className="border-b py-2 mb-4">
        <h1
          className={`text-4xl font-bold ${
            hometask.finished && "line-through"
          }`}
        >
          {hometask.title}
        </h1>
        <h2 className="text-secondary">{hometask.topic.name}</h2>
        <p className="text-gray-400">
          Due: {hometask.due?.toLocaleDateString()}
        </p>
        <EditHometask
          hometask={hometask}
          router={router}
          topics={topics}
          session={session}
        />
      </div>
      <ReactMarkdown className="markdown">
        {hometask.content || "there is no content..."}
      </ReactMarkdown>
    </div>
  );
};

export default HometaskView;
