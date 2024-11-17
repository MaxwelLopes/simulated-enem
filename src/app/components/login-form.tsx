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
import { signIn } from "next-auth/react"
import useLogin from "../hook/userLogin"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const router = useRouter();
  const { email, setEmail, password, setPassword, error, setError } =
    useLogin();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      if (res.error === "CredentialsSignin") {
        setError("Email ou senha incorretos.");
      } else {
        setError("Ocorreu um erro ao tentar fazer login. Tente novamente.");
      }
    } else {
      router.push("/");
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Digite seu e-mail abaixo para fazer login em sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4"> 
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email" // verificar
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="m@exemplo.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Esqueceu sua senha?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              />
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login com
          <span className="inline-flex">
            <span className="text-blue-500 font-bold">G</span>
            <span className="text-red-500 font-bold">o</span>
            <span className="text-yellow-500 font-bold">o</span>
            <span className="text-blue-500 font-bold">g</span>
            <span className="text-green-500 font-bold">l</span>
            <span className="text-red-500 font-bold">e</span>
          </span>
          </Button>
        </div>
      </form>
        <div className="mt-4 text-center text-sm">
            Não possui uma conta?{" "}
          <Link href="/signup" className="underline">
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
