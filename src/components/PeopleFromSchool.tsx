import Link from "next/link";
import { trpc } from "utils/trpc";
import Avatar from "./Avatar";

type PeopleFromSchoolProps = { id: string; schoolId: string };

const PeopleFromSchool = ({ id, schoolId }: PeopleFromSchoolProps) => {
  const { data } = trpc.useQuery(["user.peopleFromSchool", { id, schoolId }]);

  return (
    <div className="hidden md:block">
      <h1 className="text-2xl font-semibold text-center">People from School</h1>
      <ul>
        {data?.map((student) => (
          <li
            key={student.id}
            className="my-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:duration-300"
          >
            <Link href={`/users/${student.id}`}>
              <a className="flex items-center justify-between">
                <div className="flex items-center">
                  {student.image && <Avatar src={student.image} size={32} />}
                  <span className="text-xl p-2">{student.name}</span>
                </div>
                <span className="text-xl px-2 rounded bg-gray-100 dark:bg-gray-800">
                  {student.rooms.length}
                </span>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PeopleFromSchool;
