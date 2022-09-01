import { signIn } from "next-auth/react";
import { ACTION_BUTTON, CARD } from "../styles";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center">
      <div className={`${CARD} max-w-[60ch] mx-auto w-full`}>
        <h1 className="text-center text-3xl font-bold">
          You are not signed in!
        </h1>
        <p className="text-center my-4">get yo stuff to authentication page!</p>
        <button className={ACTION_BUTTON} onClick={() => signIn()}>
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
