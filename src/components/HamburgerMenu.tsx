import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { IoAdd, IoList, IoLogInOutline, IoPerson } from "react-icons/io5";

type HamburgerMenuProps = { session: Session | null };

const HamburgerMenu = ({ session }: HamburgerMenuProps) => {
  return (
    <div className="flex flex-col gap-2 absolute right-8 top-14 rounded bg-gray-100 dark:bg-gray-800">
      <Link href="/feed">
        <a className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
          <IoList /> Feed
        </a>
      </Link>
      {session ? (
        <>
          <Link href="/new">
            <a className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
              <IoAdd /> New Room
            </a>
          </Link>
          <Link href={`/users/${session.user?.id}`}>
            <a className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
              <IoPerson /> Profile
            </a>
          </Link>
        </>
      ) : (
        <button
          className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
          onClick={() => signIn()}
        >
          <IoLogInOutline /> Sign in
        </button>
      )}
      {/* Social Links */}
      <div className="border-t-2 border-gray-400">
        <a
          href="https://github.com/Dositan/jazbahana/"
          className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
        >
          <FaGithub /> Github
        </a>
        <a
          href="https://instagram.com/dastanozgeldi/"
          className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
        >
          <FaInstagram /> Instagram
        </a>
      </div>
    </div>
  );
};

export default HamburgerMenu;
