import type { School, User } from "@prisma/client";
import type { Session } from "next-auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ACTION_BUTTON,
  CARD,
  INPUT_SELECT,
  INPUT_TEXT,
  LABEL,
  TEXTAREA,
} from "styles";
import { trpc } from "utils/trpc";

type EditProfileProps = {
  data?: (User & { school: School | null }) | null;
  schools?: School[] | null;
  session: Session | null;
};

type FormData = {
  bio: string;
  schoolId: string;
  grade: string;
};

const EditProfile = ({ data, schools, session }: EditProfileProps) => {
  // States
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(data?.bio);
  const [schoolId, setSchoolId] = useState(data?.schoolId);
  const [grade, setGrade] = useState(data?.grade);
  // Form
  const { register, handleSubmit } = useForm<FormData>();
  // tRPC
  const utils = trpc.useContext();
  const editProfile = trpc.useMutation("user.edit", {
    async onSuccess() {
      await utils.invalidateQueries([
        "user.info",
        { id: session?.user?.id || "" },
      ]);
    },
  });

  const onSubmit = handleSubmit(async () => {
    try {
      await editProfile.mutateAsync({
        id: session?.user?.id || "",
        data: {
          bio: bio || "",
          schoolId: schoolId || "",
          grade: grade || "",
        },
      });
    } catch {}
  });
  return (
    <>
      <button className={ACTION_BUTTON} onClick={() => setEditing(!editing)}>
        Edit Profile
      </button>
      <div className="max-w-[60ch] w-full" hidden={!editing}>
        <div className={`my-10 flex items-center justify-center ${CARD}`}>
          <form className="w-[90%]" onSubmit={onSubmit}>
            <h2 className="text-center text-3xl font-bold mb-2">
              Edit Profile
            </h2>
            {/* School */}
            <div className="my-4">
              <label className={LABEL} htmlFor="schoolId">
                School:
              </label>
              <select
                {...register("schoolId")}
                id="schoolId"
                className={INPUT_SELECT}
                onChange={(e) => setSchoolId(e.currentTarget.value)}
              >
                <option selected>Choose a school</option>
                {schools &&
                  schools.map((s: School) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
            {/* Grade */}
            <div>
              <label className={LABEL} htmlFor="grade">
                Grade:
              </label>
              <input
                id="grade"
                {...register("grade")}
                className={INPUT_TEXT}
                value={grade || ""}
                onChange={(e) => setGrade(e.currentTarget.value)}
                disabled={editProfile.isLoading}
              />
            </div>

            {/* Bio */}
            <div className="my-4">
              <label className={LABEL} htmlFor="bio">
                Bio:
              </label>
              <textarea
                id="bio"
                {...register("bio")}
                className={TEXTAREA}
                value={bio || ""}
                onChange={(e) => setBio(e.currentTarget.value)}
                disabled={editProfile.isLoading}
              />
            </div>

            <button
              className="py-2 px-4 rounded-md text-white bg-teal-400 hover:bg-teal-500 hover:duration-500"
              type="submit"
              disabled={editProfile.isLoading}
            >
              Save
            </button>

            {editProfile.error && (
              <p className="text-red-500">{editProfile.error.message}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
