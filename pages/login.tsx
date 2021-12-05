import { useRouter } from "next/router";
import React, { useEffect } from "react";
import useAuth from "../firebase/auth/hook/auth";

export default function Login() {
  const router = useRouter();
  const { user, loginWithGoogle }: any = useAuth();
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [router, user]);
  return (
    <div className="bg-gradient-to-tr from-gray-50 to-gray-300 flex items-center flex-col justify-center w-full h-[100vh]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="120"
        height="120"
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M10 10.111V1l11 6v14H3V7z" />
      </svg>
      <button
        className="px-5 py-4 text-white transition-all duration-200 bg-black hover:bg-white hover:text-black text-bold"
        onClick={loginWithGoogle}
      >
        Login
      </button>
    </div>
  );
}
