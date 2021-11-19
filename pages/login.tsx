import React from "react";
import useAuth from "../firebase/auth/hook/auth";

export default function Login() {
  const { user, loginWithGoogle, logout }: any = useAuth();
  return (
    <div>
      <button onClick={loginWithGoogle}>Login</button>
      <div>{user?.email}</div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
