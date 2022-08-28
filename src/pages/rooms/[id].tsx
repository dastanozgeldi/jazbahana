import NextError from "next/error";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const RoomViewPage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const roomQuery = trpc.useQuery(["room.byId", { id }]);

  if (roomQuery.error) {
    return (
      <NextError
        title={roomQuery.error.message}
        statusCode={roomQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (roomQuery.status !== "success") {
    return <>Loading...</>;
  }
  const { data } = roomQuery;
  return (
    <>
      <h1 className="text-4xl font-extrabold">{data.title}</h1>
      <p className="text-gray-400">
        Created {data.createdAt.toLocaleDateString("en-us")}
      </p>

      <p>{data.description}</p>

      <h2>Raw data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
};

export default RoomViewPage;
