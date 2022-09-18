import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <a className="flex items-center px-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300">
        <Image src="/logo.png" width={48} height={48} alt="logo" />
        <span className="text-xl font-medium">Jazbahana</span>
      </a>
    </Link>
  );
};

export default Logo;
