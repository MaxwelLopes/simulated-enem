"use client";

import { useState } from "react";

const useLogin = () => {
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>(""); 
  const [error, setError] = useState<string | null>(null);

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
  };
};

export default useLogin;