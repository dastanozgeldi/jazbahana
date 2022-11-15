import type { Session } from "next-auth";
import type { User } from "@prisma/client";
import { Avatar } from "components/common/Avatar";
import Link from "next/link";
import { GoSettings, GoSignOut } from "react-icons/go";
import { IoPerson, IoSchool } from "react-icons/io5";
import { MdForum } from "react-icons/md";
import ReactMarkdown from "react-markdown";

type InfoProps = { user?: (User & any) | null; session: Session | null };

export const PROFILE =
  "border-[1px] border-gray-700 gap-2 w-[100px] h-[100px] flex flex-col items-center justify-center rounded-[10px] text-xl";

export const Info = ({ user, session }: InfoProps) => {
  return (
    <div className="my-4 border-[1px] rounded-[10px] border-gray-700 p-4 h-max">
      <div className="relative flex justify-around items-center">
        {/* Settings */}
        {session?.user?.id === user?.id && (
          <>
            <Link
              href="/settings"
              className="absolute top-5 left-2 hover:text-blue-500 duration-500"
            >
              <GoSettings className="w-12 h-12" />
            </Link>
            <Link
              href="/api/auth/signout"
              className="absolute top-5 right-2 hover:text-blue-500 duration-500"
            >
              <GoSignOut className="w-12 h-12" />
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
          <div className={`${PROFILE} text-center`}>
            <IoSchool className="w-7 h-7" />
            {user.school.name}
          </div>
        )}
        {user?.grade && (
          <div className={PROFILE}>
            <IoPerson className="w-7 h-7" />
            {user.grade}
          </div>
        )}
        <div className={PROFILE}>
          <MdForum className="w-7 h-7" />
          {user?.Room.length}
        </div>
      </div>

      {user?.bio && (
        <>
          <p className="text-xl">Bio</p>
          <p className="border-[1px] border-gray-700 p-4 rounded-[10px] text-lg">
            <ReactMarkdown>{user.bio}</ReactMarkdown>
          </p>
        </>
      )}
    </div>
  );
};
