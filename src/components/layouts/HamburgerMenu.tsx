import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";
import {
  IoAdd,
  IoList,
  IoLogInOutline,
  IoNewspaperOutline,
  IoPerson,
} from "react-icons/io5";
import { MdWorkOutline } from "react-icons/md";

type HamburgerMenuProps = { session: Session | null };

const HAMBURGER_ITEM =
  "flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500";

const HamburgerMenu = ({ session }: HamburgerMenuProps) => {
  return (
    <div className="flex flex-col absolute right-8 top-14 rounded bg-gray-100 dark:bg-gray-800">
      <Link href="/feed">
        <a className={HAMBURGER_ITEM}>
          <IoList /> Feed
        </a>
      </Link>
      <Link href="/workspace">
        <a className={HAMBURGER_ITEM}>
          <MdWorkOutline /> Workspace
        </a>
      </Link>
      <Link href="/news">
        <a className={HAMBURGER_ITEM}>
          <IoNewspaperOutline /> News
        </a>
      </Link>
      {session ? (
        <>
          <Link href="/new/note">
            <a className={HAMBURGER_ITEM}>
              <IoAdd /> New Note
            </a>
          </Link>
          <Link href={`/users/${session.user?.id}`}>
            <a className={HAMBURGER_ITEM}>
              <IoPerson /> Profile
            </a>
          </Link>
        </>
      ) : (
        <button className={HAMBURGER_ITEM} onClick={() => signIn()}>
          <IoLogInOutline /> Sign In
        </button>
      )}
      {/* Social Links */}
      <div className="border-t-2 border-gray-400">
        <a
          href="https://github.com/Dositan/jazbahana/"
          className={HAMBURGER_ITEM}
        >
          <FaGithub /> Github
        </a>
        <a
          href="https://instagram.com/dastanozgeldi/"
          className={HAMBURGER_ITEM}
        >
          <FaInstagram /> Instagram
        </a>
      </div>
    </div>
  );
};

export default HamburgerMenu;
