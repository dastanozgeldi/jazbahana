import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { BiLogInCircle } from "react-icons/bi";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HamburgerMenu } from "./HamburgerMenu";
import { Logo } from "./Logo";
import { Avatar } from "components/common/Avatar";
import { ToggleTheme } from "components/common/ToggleTheme";

type NavProps = {
  mounted: boolean;
  links: { label: string; href: string }[];
};

export const Nav = ({ mounted, links }: NavProps) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed transition border-b border-gray-500 bg-opacity-80 w-full z-10 backdrop-blur flex items-center justify-between px-4 py-2">
      <Logo />
      {/* Links */}
      <div className="hidden md:flex items-center">
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="text-lg rounded-xl py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xl">
        <div className="hidden md:flex gap-2 items-center justify-around text-3xl md:text-4xl">
          <a href="https://discord.gg/jgE2m4cnFj">
            <FaDiscord size={32} />
          </a>
          <a href="https://github.com/Dositan/jazbahana">
            <FaGithub size={32} />
          </a>
          {session ? (
            <Link
              href={`/users/${session.user?.id}`}
              className="rounded-full hover:ring-2 ring-gray-300"
            >
              <Avatar src={session.user?.image} size={32} />
            </Link>
          ) : (
            <button className="text-xl" onClick={() => signIn()}>
              <BiLogInCircle size={32} />
            </button>
          )}
        </div>
        <ToggleTheme mounted={mounted} />
        {open && <HamburgerMenu session={session} />}
        <button
          aria-label="Hamburger Menu"
          type="button"
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center hover:ring-2 ring-gray-300 transition-all md:hidden flex"
          onClick={() => setOpen(!open)}
        >
          <GiHamburgerMenu />
        </button>
      </div>
    </nav>
  );
};
