import Link from "next/link"

import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { useSingup } from "../hook/userSingup"
import { useRouter } from "next/navigation"
import { createUser } from "../service/userService"

export default function RegisterForm() {
  const router = useRouter();

  const {
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
  } = useSingup();

  const handleSubmitWithRedirect = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result = await createUser(name, email, password);

    if (result?.success) {
      setSuccess("Usuário registrado com sucesso! Você pode fazer login.");
      setError("");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } else {
      setError(
        result?.message ||
          "Ocorreu um erro ao tentar registrar. Tente novamente."
      );
      setSuccess("");
    }
  };
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Cadastre-se</CardTitle>
        <CardDescription>
          Insira suas informações para criar uma conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 bg-white" onSubmit={handleSubmitWithRedirect}>
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nome</Label>
              <Input 
              id="first-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Hugo" 
              required />
            </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
            id="password" 
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <Button type="submit" className="w-full">
            Criar uma conta
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Já possui uma conta?{" "}
          <Link href="/login" className="underline">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
