import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { trpc } from "utils/trpc";

const HometaskView = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, status } = trpc.useQuery(["hometask.byId", { id }]);
  const { status: authStatus } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/api/auth/signin");
    },
  });

  if (!data || status !== "success" || authStatus === "loading")
    return "Loading or not authenticated...";
  return (
    <div className="max-w-[60ch] mx-auto">
      {/* Header */}
      <div className="border-b py-2 mb-4">
        <h1 className="text-2xl md:text-4xl font-bold">{data.title}</h1>
        <h2>{data.topic.name}</h2>
      </div>
      <ReactMarkdown className="markdown">
        {data.content || "no data"}
      </ReactMarkdown>
    </div>
  );
};

export default HometaskView;
