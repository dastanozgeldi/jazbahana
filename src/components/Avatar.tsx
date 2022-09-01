type AvatarProps = { src?: string | null; size: number };

const Avatar = ({ src, size }: AvatarProps) => {
  return (
    <img
      alt="avatar"
      className="rounded-full border-[1px] border-teal-400"
      src={src || "/default-avatar.png"}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
