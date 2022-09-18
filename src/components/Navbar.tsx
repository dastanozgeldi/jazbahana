import ToggleTheme from "components/ToggleTheme";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import Avatar from "./Avatar";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = () => {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed transition border-b border-gray-500 bg-opacity-80 w-full z-10 backdrop-blur flex items-center justify-between px-4 py-2">
      {/* Logo */}
      <Link href="/">
        <a className="flex items-center px-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300">
          <Image src="/logo.png" width={48} height={48} alt="logo" />
          <span className="text-xl font-medium">Jazbahana</span>
        </a>
      </Link>
      {/* Links */}
      <div className="flex items-center gap-4 text-xl">
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/feed">
            <a className="text-lg rounded-xl py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
              Feed
            </a>
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xl">
        <div className="hidden sm:flex gap-2 items-center justify-around text-3xl md:text-4xl">
          <a href="https://discord.gg/jgE2m4cnFj">
            <FaDiscord size={32} />
          </a>
          <a href="https://github.com/Dositan/jazbahana">
            <FaGithub size={32} />
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

export default Navbar;
