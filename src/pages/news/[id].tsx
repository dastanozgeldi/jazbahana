import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { trpc } from "utils/trpc";

const NewsView = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const { data, status } = trpc.news.byId.useQuery({ id });

  if (!data || status !== "success") return <>Loading...</>;
  return (
    <div className="max-w-[60ch] mx-auto">
      {/* Header */}
      <div className="border-b py-2 mb-4">
        <h1 className="text-2xl md:text-4xl font-bold">{data.title}</h1>
        <h2 className="text-xl text-gray-400">{data.description}</h2>
        <h2>{data.views} views</h2>
      </div>
      <ReactMarkdown className="markdown">{data.content}</ReactMarkdown>
    </div>
  );
};

export default NewsView;
