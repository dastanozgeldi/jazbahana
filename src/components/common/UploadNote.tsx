import { type FormEvent, Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ACTION_BUTTON, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";

type UploadNoteProps = {
  className?: string;
};

export const UploadNote = ({ className = "" }: UploadNoteProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [file, setFile] = useState<any>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingStatus, setUploadingStatus] = useState<any>();

  const [note, setNote] = useState({
    name: "",
    topicId: "",
  });

  const { mutateAsync: createPresignedUrl } =
    trpc.note.createPresignedUrl.useMutation();
  const notesQuery = trpc.note.getNotesForUser.useQuery();

  const selectFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const uploadNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    else if (file.size > 8_388_608) {
      alert(
        "Maximum file size is 8MB. Please compress or choose another file."
      );
      setFile(undefined);
      return;
    }

    setUploadingStatus("Uploading your note to our storage");

    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl({
        filename: file.name,
      })) as any;

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    setFile(undefined);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setUploadingStatus(
      "Saved! Now you can close this window and check your workspace!"
    );
    notesQuery.refetch();
  };

  return (
    <>
      {/* The button to open modal */}
      <label
        htmlFor="file-select-modal"
        className={`${ACTION_BUTTON} ${className}`}
      >
        Upload Note
      </label>
      <input
        type="checkbox"
        id="file-select-modal"
        className="hidden"
        onClick={() => setIsOpen(true)}
      />

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 dark:bg-[#111] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                  >
                    Upload a file you've just exported!
                  </Dialog.Title>
                  <form
                    className="w-full border-gray-700 p-4 space-y-4"
                    onSubmit={uploadNote}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      onChange={(e) => selectFile(e)}
                    />
                    <div className="flex items-center gap-3">
                      {file && (
                        <button
                          type="submit"
                          className={`${ACTION_BUTTON} my-2`}
                        >
                          Upload a File!
                        </button>
                      )}
                      {uploadingStatus && <p>{uploadingStatus}</p>}
                    </div>
                    <input
                      className={INPUT_TEXT}
                      onChange={(e) =>
                        setNote({ ...note, name: e.target.value })
                      }
                      value={file?.name}
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
