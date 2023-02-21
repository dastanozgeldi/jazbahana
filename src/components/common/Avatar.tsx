import Image from "next/image";
import defaultAvatar from "assets/images/default-avatar.png";

type AvatarProps = { src?: string | null; size: number };

export const Avatar = ({ src, size }: AvatarProps) => (
  <Image
    alt="Avatar"
    className="rounded-full border-[1px] border-blue-400"
    src={src ?? defaultAvatar}
    width={size}
    height={size}
  />
);
