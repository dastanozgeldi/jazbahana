import { trpc } from "utils/trpc";

export const Participants = ({ roomId }: { roomId: string }) => {
  const { data: participants } = trpc.useQuery(["participant.all", { roomId }]);
  return (
    <div className="hidden md:block w-[50%]">
      <h1 className="text-2xl font-semibold text-center">
        Participants [{participants?.length}]
      </h1>
      {participants &&
        participants.map((item) => (
          <div>
            <p>{item.user.name}</p>
          </div>
        ))}
    </div>
  );
};
