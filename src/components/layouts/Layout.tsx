import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "../Avatar";

type LayoutProps = { children: React.ReactNode };
type NavbarProps = { session: Session | null };
type HamburgerMenuProps = { session: Session | null };

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Jazbahana is a note-trader app created to help students all around the world."
        />
        <meta name="author" content="Jolshylar" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="Jazbahana - Get Notes Faster" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@jolshylar" />
        <meta
          name="twitter:image"
          content="https://jazbahana.vercel.app/card.png"
        />
        <meta property="og:site_name" content="Jazbahana" />
        <meta name="og:title" content="Jazbahana - Get Notes Faster" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://jazbahana.vercel.app/card.png"
        />
        <title>Jazbahana - Get Notes Faster</title>
      </Head>
      <Navbar session={session} />
      <main className="p-4">{children}</main>
    </>
  );
}

const Navbar = ({ session }: NavbarProps) => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="flex items-center justify-between px-8">
      {/* Logo */}
      <Link href="/">
        <a className="flex items-center">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <span className="md:text-3xl text-xl font-bold">Jazbahana</span>
        </a>
      </Link>
      {/* Search bar */}
      <Search />
      {/* Links */}
      <div className="flex items-center gap-4 text-xl">
        <div className="sm:flex items-center gap-4 hidden">
          <Link href="/feed">
            <a>Feed</a>
          </Link>
          <a href="https://tapsyr.dosek.xyz/" target="_blank" rel="noreferrer">
            Tasks
          </a>
          {session ? (
            <>
              <Link href={`/users/${session.user?.id}`}>
                <a>
                  <Avatar src={session.user?.image} size={36} />
                </a>
              </Link>
            </>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
          )}
        </div>
        {/* Toggle theme */}
        <ToggleTheme mounted={mounted} />
        <button
          aria-label="Hamburger Menu"
          type="button"
          className="w-9 h-9 p-0 bg-gray-200 rounded-full dark:bg-gray-600  items-center justify-center hover:ring-2 ring-gray-300  transition-all sm:hidden flex"
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
        {open && <HamburgerMenu session={session} />}
      </div>
    </nav>
  );
};

const HamburgerMenu = ({ session }: HamburgerMenuProps) => {
  return (
    <div className="flex flex-col gap-2 w-[50%] absolute right-8 top-14 rounded-md bg-gray-200 dark:bg-gray-600">
      <Link href="/feed">
        <a className="rounded-t-md p-4 hover:bg-gray-100 dark:hover:bg-gray-700 hover:duration-500">
          Feed
        </a>
      </Link>
      <a className="rounded-t-md p-4 hover:bg-gray-100 dark:hover:bg-gray-700 hover:duration-500">
        Feed
      </a>
      {session ? (
        <Link href={`/users/${session.user?.id}`}>
          <a className="rounded-b-md p-4 hover:bg-gray-100 dark:hover:bg-gray-700 hover:duration-500">
            Profile
          </a>
        </Link>
      ) : (
        <a
          className="p-4 rounded-b-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:duration-500"
          onClick={() => signIn()}
        >
          Sign in
        </a>
      )}
    </div>
  );
};

const Search = () => {
  return (
    <div className="hidden md:flex h-[36px] items-center">
      <button className="rounded-l-full text-gray-400 bg-gray-200 dark:bg-gray-700 pl-3 h-[36px]">
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <input
        placeholder="Search for rooms"
        className="outline-none rounded-r-full h-[36px] p-3 focus-none bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
};

const ToggleTheme = ({ mounted }: { mounted: boolean }) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="w-9 h-9 p-0 bg-gray-200 rounded-full dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300 transition-all"
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
