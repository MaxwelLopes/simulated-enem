"use client";

import { signIn, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button"; // ShadCN Button

export const LoginButton = () => {
  return (
    <Button onClick={() => signIn()} className="bg-primary text-primary-foreground">
      Entrar
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut()}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:ring-destructive/50"
    >
      <LogOut className="h-5 w-5" />
      <span className="sr-only">Sair</span>
    </Button>
  );
};
