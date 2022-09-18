import Link from "next/link";
import { HIGHLIGHT } from "styles";
import Logo from "./Logo";
import ToggleTheme from "./ToggleTheme";

type FooterProps = {
  mounted: boolean;
  links: { label: string; href: string }[];
};

const Footer = ({ mounted, links }: FooterProps) => {
  return (
    <footer className="my-2 flex flex-col gap-2 justify-center sm:grid sm:grid-cols-3 sm:justify-items-center items-center">
      <Logo />
      {/* Site Links */}
      <div>
        {links.map((l) => (
          <Link key={l.label} href={l.href}>
            <a className="text-lg rounded-xl py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-500">
              {l.label}
            </a>
          </Link>
        ))}
      </div>
      <div className="my-2">
        <ToggleTheme mounted={mounted} />
      </div>
      <hr />
      <h1 className="text-center">
        made with ❤️ by{" "}
        <a className={HIGHLIGHT} href="https://linkedin.com/in/dastanozgeldi">
          Dastan
        </a>
      </h1>
    </footer>
  );
};

export default Footer;
