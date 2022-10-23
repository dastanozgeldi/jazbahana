import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import Avatar from "components/Avatar";
import Link from "next/link";
import { GoSettings, GoSignOut } from "react-icons/go";
import { IoGlobe, IoLogoTwitter, IoPerson, IoSchool } from "react-icons/io5";
import { MdForum } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { PROFILE } from "styles";

type InfoProps = { user?: (User & any) | null; session: Session | null };

export const Info = ({ user, session }: InfoProps) => {
  return (
    <div className="my-4 border-[1px] rounded-[10px] border-gray-700 p-4">
      <div className="relative flex justify-around items-center">
        {/* Settings */}
        {session?.user?.id === user?.id && (
          <>
            <Link href="/settings">
              <a className="absolute top-5 left-2 hover:text-teal-400 duration-500">
                <GoSettings className="w-16 h-16" />
              </a>
            </Link>
            <Link href="/api/auth/signout">
              <a className="absolute top-5 right-2 hover:text-teal-400 duration-500">
                <GoSignOut className="w-16 h-16" />
              </a>
            </Link>
          </>
        )}
        <div className="flex flex-col items-center justify-center">
          <Avatar src={user?.image} size={100} />
          <h1 className="text-3xl font-medium mt-4">{user?.name}</h1>
        </div>
        {/* Sign Out */}
      </div>
      {/* General Info */}
      <div className="flex items-center justify-between my-4 gap-2">
        {user?.school && (
          <div className={PROFILE}>
            <IoSchool className="w-7 h-7" />
            NIS PhM
          </div>
        )}
        {user?.grade && (
          <div className={PROFILE}>
            <IoPerson className="w-7 h-7" />
            10D
          </div>
        )}
        <div className={PROFILE}>
          <MdForum className="w-7 h-7" />
          {user?.Room.length}
        </div>
      </div>

      {user?.bio && (
        <p className="w-full bg-[#202020] text-lg p-4 rounded-[10px]">
          <ReactMarkdown>{user.bio}</ReactMarkdown>
        </p>
      )}
      {/* If user has a website */}
      <p className="hover:text-teal-400 hover:text-[18.5px] duration-500 my-4 flex items-center gap-2 bg-[#202020] text-lg p-4 rounded-[10px]">
        <IoGlobe /> dosek.xyz
      </p>
      {/* If user has set a twitter account */}
      <p className="hover:text-teal-400 hover:text-[18.5px] duration-500 flex items-center gap-2 bg-[#202020] text-lg p-4 rounded-[10px]">
        <IoLogoTwitter /> sbek22_
      </p>
    </div>
  );
};
