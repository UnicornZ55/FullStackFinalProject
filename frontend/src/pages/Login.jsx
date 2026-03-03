import { useState } from "react";
import axios from "../api/axios";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const setUser = useAuthStore((s) => s.setUser);

  const login = async () => {
    const res = await axios.post("/auth/login", {
      email: "admin@test.com",
      password: "123456",
    });
    setUser(res.data);
  };

  return <button onClick={login}>Login</button>;
}