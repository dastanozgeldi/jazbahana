import Footer from "components/Footer";
import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type LayoutProps = { children: React.ReactNode };

export default function Layout({ children }: LayoutProps) {
  const [mounted, setMounted] = useState(false);
  const links = [
    { label: "Feed", href: "/feed" },
    { label: "New Room", href: "/new" },
  ];

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
      <Navbar mounted={mounted} links={links} />
      <main className="px-4 py-20 sm:container mx-auto">{children}</main>
      <Footer mounted={mounted} links={links} />
    </>
  );
}
