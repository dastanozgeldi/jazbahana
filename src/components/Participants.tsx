import Link from "next/link";
import { CARD } from "styles";
import { trpc } from "utils/trpc";
import Avatar from "./Avatar";

export const Participants = ({ roomId }: { roomId: string }) => {
  const { data: participants } = trpc.useQuery(["participant.all", { roomId }]);

  return (
    <div className={`${CARD} lg:mx-4`}>
      <h1 className="my-2 text-2xl font-semibold text-center">
        Participants [{participants?.length}]
      </h1>
      <div className="flex flex-nowrap gap-1 overflow-x-scroll">
        {participants &&
          participants.map((item) => (
            <>
              <Link href={`/users/${item.userId}`}>
                <a>
                  <Avatar src={item.user.image} size={32} />
                </a>
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};
