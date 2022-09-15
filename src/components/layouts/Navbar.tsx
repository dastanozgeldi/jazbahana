import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoList,
  IoLogoDiscord,
  IoLogoGithub,
  IoLogoInstagram,
  IoPerson,
} from "react-icons/io5";
import Avatar from "../Avatar";

const Navbar = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed transition border-b border-gray-500 bg-opacity-80 w-full z-10 backdrop-blur flex items-center justify-between px-4 py-2">
      {/* Logo */}
      <Link href="/">
        <a className="flex items-center">
          <Image src="/logo.png" width={48} height={48} alt="logo" />
          <span className="text-xl font-medium">Jazbahana</span>
        </a>
      </Link>
      {/* Links */}
      <div className="flex items-center gap-4 text-xl">
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/feed">
            <a>Feed</a>
          </Link>
          <a href="https://tapsyr.dosek.xyz/" target="_blank" rel="noreferrer">
            Tasks
          </a>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xl">
        <div className="hidden sm:flex gap-2 items-center justify-around text-3xl md:text-4xl">
          <a href="https://discord.gg/jgE2m4cnFj">
            <IoLogoDiscord size={32} />
          </a>
          <a href="https://github.com/Dositan/jazbahana">
            <IoLogoGithub size={32} />
          </a>
          {session ? (
            <>
              <Link href={`/users/${session.user?.id}`}>
                <a>
                  <Avatar src={session.user?.image} size={32} />
                </a>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
          )}
        </div>
        <ToggleTheme mounted={mounted} />
        {open && <HamburgerMenu session={session} />}
        <button
          aria-label="Hamburger Menu"
          type="button"
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center hover:ring-2 ring-gray-300 transition-all sm:hidden flex"
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

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
        <Link href={`/users/${session.user?.id}`}>
          <a className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
            <IoPerson /> Profile
          </a>
        </Link>
      ) : (
        <a
          className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
          onClick={() => signIn()}
        >
          Sign in
        </a>
      )}
      {/* Social Links */}
      <div className="border-t-2 border-gray-400">
        <a
          href="https://github.com/Dositan/jazbahana/"
          className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
        >
          <IoLogoGithub /> Github
        </a>
        <a
          href="https://instagram.com/dastanozgeldi/"
          className="flex items-center gap-2 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
        >
          <IoLogoInstagram /> Instagram
        </a>
      </div>
    </div>
  );
};

const ToggleTheme = ({ mounted }: { mounted: boolean }) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-8 h-8 p-0 bg-gray-200 rounded-full dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5 text-gray-800 dark:text-gray-200"
        >
          {theme === "dark" ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          )}
        </svg>
      )}
    </button>
  );
};

export default Navbar;
