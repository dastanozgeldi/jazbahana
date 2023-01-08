import Head from "next/head";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Nav } from "./Nav";
import { Inter } from "@next/font/google";

const inter = Inter({ variable: "--font-inter" });

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const links = [
    { label: "Feed", href: "/feed" },
    { label: "Workspace", href: "/workspace" },
    { label: "News", href: "/news" },
  ];

  const [parent] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Jazbahana is a note-trader app created to help students all around the world."
        />
        <meta name="author" content="Dastan Özgeldi" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:title" content="Jazbahana - Study Efficiently" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@dastanozgeldi" />
        <meta
          name="twitter:image"
          content="https://jazbahana.dosek.xyz/card.png"
        />
        <meta property="og:site_name" content="Jazbahana" />
        <meta name="og:title" content="Jazbahana - Study Efficiently" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://jazbahana.dosek.xyz/card.png"
        />
        <title>Jazbahana - Study Efficiently</title>
      </Head>
      <div className={inter.variable}>
        <Nav mounted={mounted} links={links} />
        <main ref={parent} className="p-4 sm:container mx-auto">
          {children}
        </main>
      </div>
    </>
  );
};
