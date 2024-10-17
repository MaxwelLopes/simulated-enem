import { useState } from "react";
import { createUser } from "@/app/service/user";
import { signOut, useSession } from "next-auth/react";

const useSingup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createUser(name, email, password);

    if (response.success) {
      setSuccess("Usuário registrado com sucesso! Você pode fazer login.");
      setError("");
    } else {
      setError(response.message);
      setSuccess("");
    }
  };

  if (status === "authenticated") {
    signOut({ redirect: false });
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    success,
    handleSubmit,
  };
};

export default useSingup;
