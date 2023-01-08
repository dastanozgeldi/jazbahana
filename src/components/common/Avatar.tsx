import Image from "next/image";

type AvatarProps = { src?: string | null; size: number };

export const Avatar = ({ src, size }: AvatarProps) => (
  <Image
    alt="Avatar"
    className="rounded-full border-[1px] border-blue-400"
    src={src ?? "/default-avatar.png"}
    width={size}
    height={size}
  />
);
