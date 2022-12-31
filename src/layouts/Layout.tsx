import Head from "next/head";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Nav } from "./Nav";

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
      <Nav mounted={mounted} links={links} />
      <main ref={parent} className="py-20 px-4 sm:container mx-auto">
        {children}
      </main>
    </>
  );
};
