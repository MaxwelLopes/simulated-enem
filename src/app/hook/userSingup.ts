import { useState } from "react";

export const userSingup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
  };
};
