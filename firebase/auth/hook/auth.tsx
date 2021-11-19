// @ts-nocheck
import { GoogleAuthProvider, signInWithPopup } from "@firebase/auth";
import { createContext, useContext, useState } from "react";
// import AuthService from "../service/AuthService";
import { auth } from "../../config";

const authContext = createContext();

export default function useAuth() {
  return useContext(authContext);
}

export function AuthProvider(props) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
      await fetch("/api/db/teacher/create", {
        method: "POST",
        body: JSON.stringify({
          email: user?.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(user ?? null);
    } catch (error) {
      setError(error ?? "");
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };
  const value = { user, error, loginWithGoogle, logout, setUser };

  return <authContext.Provider value={value} {...props} />;
}
