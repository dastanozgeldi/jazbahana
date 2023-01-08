import Link from "next/link";
import { FC, PropsWithChildren } from "react";
import { IoCopy, IoHome, IoPerson } from "react-icons/io5";

export const Workspace: FC<PropsWithChildren> = ({ children }) => (
  <div className="max-w-[48ch] mx-auto flex flex-col items-center justify-around w-full">
    <aside className="mx-4 w-full flex justify-around gap-2 border-[1px] border-gray-700 p-4 rounded-xl">
      <Link
        href="/workspace"
        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300"
      >
        <IoCopy className="text-gray-400 w-5 h-5" />
      </Link>

      <Link
        href="/workspace/hometasks"
        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300"
      >
        <IoHome className="text-gray-400 w-5 h-5" />
      </Link>

      <Link
        href="/workspace/connections"
        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300"
      >
        <IoPerson className="text-gray-400 w-5 h-5" />
      </Link>
    </aside>
    <main className="mx-4 w-full">{children}</main>
  </div>
);
