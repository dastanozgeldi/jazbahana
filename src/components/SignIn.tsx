import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <>
      <h1 className="text-center text-3xl font-bold">Yo, u not signed in</h1>
      <p className="text-center">get yo stuff to signin page!</p>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  );
};

export default SignIn;
