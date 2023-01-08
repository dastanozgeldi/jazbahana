import { type FormEvent, useRef, useState } from "react";
import { ACTION_BUTTON, INPUT_TEXT } from "styles";
import { trpc } from "utils/trpc";
import { Modal } from "./Modal";

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
      <button
        className={`${ACTION_BUTTON} ${className}`}
        onClick={() => setIsOpen(true)}
      >
        Upload Note
      </button>

      <Modal title="Upload Note" isOpen={isOpen} setIsOpen={setIsOpen}>
        <form
          className="font-sans w-full border-gray-700 p-4 space-y-4"
          onSubmit={uploadNote}
        >
          <input ref={fileRef} type="file" onChange={(e) => selectFile(e)} />
          <div className="flex items-center gap-3">
            {file && (
              <button type="submit" className={`${ACTION_BUTTON} my-2`}>
                Upload a File!
              </button>
            )}
            {uploadingStatus && <p>{uploadingStatus}</p>}
          </div>
          <input
            className={INPUT_TEXT}
            onChange={(e) => setNote({ ...note, name: e.target.value })}
            value={file?.name}
          />
        </form>
      </Modal>
    </>
  );
};
