import Image from "next/image";
import Link from "next/link";

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300"
  >
    <Image src="/logo.png" width={36} height={36} alt="logo" />
    <span className="text-xl font-bold text-primary">Jazbahana</span>
  </Link>
);
