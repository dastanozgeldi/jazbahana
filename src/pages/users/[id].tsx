import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../utils/trpc";
import Page from "../../components/layouts/Page";
import RecentNotes from "../../components/RecentNotes";
import Avatar from "../../components/Avatar";
import PeopleFromSchool from "components/PeopleFromSchool";
import { NOTIFICATION } from "styles";
import { IoGlobe, IoLogoTwitter, IoPerson, IoSchool } from "react-icons/io5";
import { MdForum } from "react-icons/md";
import { GoSettings, GoSignOut } from "react-icons/go";
import { PROFILE } from "styles";

export default function Profile() {
  const { query } = useRouter();
  const id = query.id as string;
  const { data: user } = trpc.useQuery(["user.info", { id }]);
  const { data: session } = useSession();

  return (
    <Page title="Profile">
      <div className="block md:grid md:grid-cols-3 md:justify-items-center">
        <PeopleFromSchool id={user?.id || ""} schoolId={user?.schoolId || ""} />
        {/* Header */}
        <div className="flex flex-col items-center justify-center">
          {/* Notification */}
          <h1 className={`${NOTIFICATION} mt-0 text-center`}>
            This is the profile page. Here you can see some general information
            about a user.
          </h1>
          {/* User Profile Card */}
          <div className="w-full border-[1px] rounded-[10px] border-gray-700 px-8 py-4">
            <div className="relative flex justify-around items-center">
              {/* Settings */}
              {session?.user?.id === user?.id && (
                <>
                  <Link href="/settings">
                    <a className="absolute top-5 left-2 hover:text-teal-400 duration-500">
                      <GoSettings className="w-16 h-16 " />
                    </a>
                  </Link>
                  <Link href="/api/auth/signout">
                    <a className="absolute top-5 right-2 hover:text-teal-400 duration-500">
                      <GoSignOut className="w-16 h-16 " />
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
            <div className="flex items-center justify-between my-4">
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
        </div>
        <RecentNotes />
      </div>
    </Page>
  );
}
