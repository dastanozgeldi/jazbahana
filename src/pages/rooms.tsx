import Link from "next/link";
import { trpc } from "../utils/trpc";
import Page from "./layouts/Page";

const Rooms = () => {
  const utils = trpc.useContext();
  const roomsQuery = trpc.useQuery(["room.all"]);
  const addRoom = trpc.useMutation("room.add", {
    async onSuccess() {
      // refetches all rooms after successful post add
      await utils.invalidateQueries(["room.all"]);
    },
  });

  return (
    <Page title="Rooms">
      <h1 className="text-5xl font-extrabold">ROOMS</h1>
      {roomsQuery.data?.map((item) => (
        <article key={item.id}>
          <h3 className="text-2xl font-semibold">{item.title}</h3>
          <Link href={`/rooms/${item.id}`}>
            <a className="text-teal-400 hover:text-teal-500 duration-500">
              View more
            </a>
          </Link>
        </article>
      ))}
    </Page>
  );
};

export default Rooms;
