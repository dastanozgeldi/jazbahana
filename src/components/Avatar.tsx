type AvatarProps = { src?: string | null; size: number };

const Avatar = ({ src, size }: AvatarProps) => {
  return (
    <img
      className="rounded-full border-[1px] border-blue-400"
      src={src ?? "/default-avatar.png"}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
