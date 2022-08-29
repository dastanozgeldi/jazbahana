import Head from "next/head";

type PageProps = {
  children: React.ReactNode;
  className?: string;
  title: string;
};

export default function Page({ children, className = "", title }: PageProps) {
  const t = `${title} | Jazbahana`;
  return (
    <main className={className}>
      {title && (
        <Head>
          <title>{t}</title>
          <meta name="twitter:title" content={t} />
          <meta name="og:title" content={t} />
        </Head>
      )}
      {children}
    </main>
  );
}
