import { useForm } from "react-hook-form";
import { ACTION_BUTTON, CARD, INPUT_TEXT, TEXTAREA } from "../../styles";

type FormData = {
  email: string;
  feedback: string;
};

const Contacts = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit((data) => {
    console.log({ ...data });
    // TODO: send email
  });

  return (
    <div
      id="contacts"
      className="min-h-screen flex items-center justify-center mt-10"
    >
      <div className="w-full">
        <h1 className="my-8 text-4xl md:text-5xl font-extrabold text-center text-blue-500">
          Contact Us
        </h1>
        <div className={`${CARD} max-w-[60ch] mx-auto`}>
          <form onSubmit={onSubmit}>
            <h1 className="text-center text-3xl font-bold mb-4">
              Send feedback
            </h1>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                {...register("email")}
                className={INPUT_TEXT}
                type="email"
              />
            </div>
            <div className="my-4">
              <label htmlFor="feedback">Feedback:</label>
              <textarea {...register("feedback")} className={TEXTAREA} />
            </div>
            <button className={ACTION_BUTTON} type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
