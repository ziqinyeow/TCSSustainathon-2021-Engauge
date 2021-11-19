// @ts-nocheck
import React, { useEffect, useState } from "react";
import useAuth from "../hook/auth";
import { auth } from "../../config";
// import AuthService from "../service/AuthService";

export default function AuthStateChanged({ children }) {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  return <div>{children}</div>;
}
