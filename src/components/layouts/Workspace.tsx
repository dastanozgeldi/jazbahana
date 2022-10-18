import Link from "next/link";
import { IoCopy, IoHome, IoPerson, IoPlayBack } from "react-icons/io5";

type WorkspaceProps = { children: React.ReactNode };

const Workspace = ({ children }: WorkspaceProps) => {
  return (
    <div className="grid grid-cols-3">
      <aside className="w-64">
        <div className="overflow-y-auto py-4 px-3 bg-gray-100 rounded dark:bg-neutral-800 space-y-2">
          <Link href="/workspace">
            <a className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300">
              <IoPlayBack className="text-gray-400 w-5 h-5" />
              <span className="ml-3">Index Page</span>
            </a>
          </Link>
          <Link href="/workspace/hometasks">
            <a className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300">
              <IoHome className="text-gray-400 w-5 h-5" />
              <span className="ml-3">Hometasks</span>
            </a>
          </Link>
          <Link href="/workspace/notes">
            <a className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300">
              <IoCopy className="text-gray-400 w-5 h-5" />
              <span className="flex-1 ml-3 whitespace-nowrap">Notes</span>
            </a>
          </Link>
          <Link href="/workspace/connections">
            <a className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 hover:duration-300">
              <IoPerson className="text-gray-400 w-5 h-5" />
              <span className="flex-1 ml-3 whitespace-nowrap">Connections</span>
            </a>
          </Link>
        </div>
      </aside>
      {children}
    </div>
  );
};

export default Workspace;
