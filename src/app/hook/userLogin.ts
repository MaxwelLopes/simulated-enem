import { useState } from "react";
import { signIn } from "next-auth/react";
type OnSuccessCallback = () => void;

const useLogin = (onSuccess: OnSuccessCallback) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (result?.error) {
      setError("Falha no login. Verifique seu email e senha.");
    } else {
      if (onSuccess) onSuccess();
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
};

export default useLogin;
