import type { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = ({ session }: { session: Session | null }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="flex items-center justify-between px-8">
      <Link href="/">
        <a className="flex items-center">
          <Image src="/logo.png" width={64} height={64} alt="logo" />
          <span className="text-3xl font-bold">Jazbahana</span>
        </a>
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/feed">
          <a>rooms</a>
        </Link>
        {session ? (
          <>
            <Link href={`/users/${session.user?.id}`}>
              <a>
                <img
                  alt="user avatar"
                  src={session.user?.image || "/default-avatar.png"}
                  className="rounded-full border border-teal-400"
                  width={36}
                  height={36}
                />
              </a>
            </Link>
          </>
        ) : (
          <button onClick={() => signIn()}>Sign in</button>
        )}

        <button
          aria-label="Toggle Dark Mode"
          type="button"
          className="w-9 h-9 p-0 bg-gray-200 rounded-full dark:bg-gray-600 flex items-center justify-center hover:ring-2 ring-gray-300  transition-all"
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
      </div>
    </nav>
  );
};

export default Navbar;
